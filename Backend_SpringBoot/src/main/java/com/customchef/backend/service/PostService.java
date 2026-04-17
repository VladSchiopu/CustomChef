package com.customchef.backend.service;

import com.customchef.backend.entity.Post;
import com.customchef.backend.entity.Recipe;
import com.customchef.backend.entity.User;
import com.customchef.backend.exception.BadRequestException;
import com.customchef.backend.repository.PostRepository;
import com.customchef.backend.repository.RecipeRepository;
import com.customchef.backend.repository.UserRepository;
import com.customchef.backend.service.dto.PostDto;
import com.customchef.backend.service.dto.RecipeDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Transactional
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private RecipeService recipeService;

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private CommentService commentService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    private final String UPLOAD_DIR = "uploads/";

    public PostDto convertToDto(Post post, User currentUser) {

        boolean isFollowed = false;

        if (currentUser != null && currentUser.getId() != null) {
            User attachedUser = userRepository.findById(currentUser.getId()).orElse(null);

            if (attachedUser != null && attachedUser.getFriends() != null) {
                isFollowed = attachedUser.getFriends().stream()
                        .anyMatch(followedUser -> followedUser.getId().equals(post.getOwner().getId()));
            }
        }

        return new PostDto()
                .setId(post.getId())
                .setAuthorUsername(post.getOwner().getUsername())
                .setAuthorEmail(post.getOwner().getEmail())
                .setAuthorIsFollowed(isFollowed)
                .setRecipe(recipeService.convertToDto(post.getRecipe()))
                .setCreatedAt(post.getCreatedAt())
                .setComments(post.getComments() != null ?
                        post.getComments().stream()
                        .map(comment -> commentService.convertToDto(comment))
                        .toList() : null)
                .setImageUrl(post.getImageUrl() != null ? "http://localhost:8091/uploads/" + post.getImageUrl() : null);
    }

    public PostDto createPostWithImage(RecipeDto recipeDto, MultipartFile image, User user) {
        Recipe recipe = recipeService.saveRecipeEntity(recipeDto, user);
        recipe.setIsPosted(true);

        String imagePath = saveImageLocally(image);

        Post post = new Post()
                .setOwner(user)
                .setRecipe(recipe)
                .setImageUrl(imagePath);

        return convertToDto(postRepository.save(post), user);
    }

    public PostDto publishExistingRecipeWithImage(UUID recipeId, MultipartFile image, User currentUser) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new BadRequestException("Recipe not found"));

        String imagePath = saveImageLocally(image);
        recipe.setIsPosted(true);

        Post post = new Post()
                .setOwner(currentUser)
                .setRecipe(recipe)
                .setImageUrl(imagePath);

        return convertToDto(postRepository.save(post), currentUser);
    }

    private String saveImageLocally(MultipartFile file) {
        if (file == null || file.isEmpty()) return null;
        try {
            File directory = new File(UPLOAD_DIR);
            if (!directory.exists()) directory.mkdirs();

            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path path = Paths.get(UPLOAD_DIR + fileName);
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Could not save image", e);
        }
    }

    public Page<PostDto> getAllPosts(String search, Pageable pageable, User currentUser) {
        Page<Post> posts;
        if (search != null && !search.trim().isEmpty()) {
            posts = postRepository.findByRecipeTitleContainingIgnoreCase(search.trim(), pageable);
        } else {
            posts = postRepository.findAll(pageable);
        }
        return posts.map(post -> convertToDto(post, currentUser));
    }

    public Page<PostDto> getPostsByUser(UUID userId, Pageable pageable, User currentUser) {
        return postRepository.findByOwnerId(userId, pageable).map(post -> convertToDto(post, currentUser));
    }

    public PostDto updatePost(UUID id, PostDto postDto, User currentUser) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Post not found"));

        boolean isAdmin = currentUser.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ADMIN"));

        if (!post.getOwner().getId().equals(currentUser.getId()) && !isAdmin) {
            throw new BadRequestException("You don't have permission to edit this post");
        }

        if (postDto.getRecipe() != null) {
            recipeService.updateRecipe(post.getRecipe().getId(), postDto.getRecipe(), post.getOwner());
        }

        if (postDto.getImageUrl() != null && !postDto.getImageUrl().isBlank()) {
            String newImage = postDto.getImageUrl().replace("http://localhost:8091/uploads/", "");
            post.setImageUrl(newImage);
        }

        return convertToDto(post, currentUser);
    }

    public void deletePost(UUID postId, User currentUser) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BadRequestException("Post not found"));

        boolean isAdmin = currentUser.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ADMIN"));

        boolean isOwner = post.getOwner().getId().equals(currentUser.getId());

        if (!isOwner && !isAdmin) {
            throw new BadRequestException("You don't have permission to delete this post");
        }

        if (isAdmin && !isOwner) {
            emailService.sendEmail(
                    post.getOwner().getEmail(),
                    "Post deleted by admin",
                    "Hello, the post for your recipe:'" + post.getRecipe().getTitle() + "' was deleted by an admin"
            );
        }

        if (post.getRecipe() != null) {
            Recipe recipe = post.getRecipe();
            recipe.setIsPosted(false);
            post.setRecipe(null);
            recipeRepository.save(recipe);
        }

        postRepository.delete(post);
    }
}