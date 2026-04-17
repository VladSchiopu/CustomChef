package com.customchef.backend.service;

import com.customchef.backend.entity.Comment;
import com.customchef.backend.entity.Post;
import com.customchef.backend.entity.User;
import com.customchef.backend.exception.BadRequestException;
import com.customchef.backend.repository.CommentRepository;
import com.customchef.backend.repository.PostRepository;
import com.customchef.backend.service.dto.CommentDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private EmailService emailService;

    public CommentDto convertToDto(Comment comment) {
        return new CommentDto()
                .setId(comment.getId())
                .setContent(comment.getContent())
                .setAuthorUsername(comment.getAuthor().getUsername())
                .setAuthorEmail(comment.getAuthor().getEmail());
    }

    public CommentDto addComment(UUID postId, CommentDto commentDto, User author) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BadRequestException("Post not found"));

        Comment comment = new Comment()
                .setContent(commentDto.getContent())
                .setAuthor(author)
                .setPost(post);

        Comment saved = commentRepository.save(comment);
        return convertToDto(saved);
    }

    public void deleteComment(UUID commentId, User currentUser) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new BadRequestException("Comment not found"));

        boolean isAdmin = currentUser.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ADMIN"));

        boolean isAuthor = comment.getAuthor().getId().equals(currentUser.getId());

        if (!isAuthor && !isAdmin) {
            throw new BadRequestException("You don't have permission to delete this comment");
        }

        if (isAdmin && !isAuthor) {
            emailService.sendEmail(
                    comment.getAuthor().getEmail(),
                    "Comment moderated",
                    "Your comment from post: '" + comment.getPost().getRecipe().getTitle() + "' was deleted by an admin"
            );
        }

        commentRepository.delete(comment);
    }
}