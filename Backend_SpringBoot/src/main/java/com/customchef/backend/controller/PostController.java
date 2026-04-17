package com.customchef.backend.controller;

import com.customchef.backend.entity.User;
import com.customchef.backend.repository.UserRepository;
import com.customchef.backend.service.PostService;
import com.customchef.backend.service.dto.PostDto;
import com.customchef.backend.service.dto.RecipeDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.customchef.backend.service.dto.PagedResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/posts")
public class PostController implements SecuredRestController {

    @Autowired
    private PostService postService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<PagedResponse<PostDto>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = null;
        if (!email.equals("anonymousUser")) {
            currentUser = userRepository.findUserByEmail(email).orElse(null);
        }

        Page<PostDto> pageResult = postService.getAllPosts(search, pageable, currentUser);

        return ResponseEntity.ok(new PagedResponse<>(
                pageResult.getContent(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages()
        ));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<PagedResponse<PostDto>> getPostsByUser(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = null;
        if (!email.equals("anonymousUser")) {
            currentUser = userRepository.findUserByEmail(email).orElse(null);
        }

        Page<PostDto> pageResult = postService.getPostsByUser(userId, pageable, currentUser);

        return ResponseEntity.ok(new PagedResponse<>(
                pageResult.getContent(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages()
        ));
    }

    @PostMapping(value = "/create", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<PostDto> createPost(
            @RequestPart("recipe") RecipeDto recipeDto,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findUserByEmail(email).get();

        PostDto postDto = postService.createPostWithImage(recipeDto, image, currentUser);
        return new ResponseEntity<>(postDto, HttpStatus.CREATED);
    }

    @PostMapping(value = "/publish/{recipeId}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<PostDto> publishExistingRecipe(
            @PathVariable UUID recipeId,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findUserByEmail(email).get();

        PostDto postDto = postService.publishExistingRecipeWithImage(recipeId, image, currentUser);
        return new ResponseEntity<>(postDto, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<PostDto> updatePost(@PathVariable UUID id, @RequestBody PostDto postDto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findUserByEmail(email).get();

        return ResponseEntity.ok(postService.updatePost(id, postDto, currentUser));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<String> deletePost(@PathVariable UUID id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findUserByEmail(email).get();

        postService.deletePost(id, currentUser);
        return ResponseEntity.ok("Post deleted");
    }
}