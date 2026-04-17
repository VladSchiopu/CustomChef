package com.customchef.backend.controller;

import com.customchef.backend.entity.User;
import com.customchef.backend.repository.UserRepository;
import com.customchef.backend.service.CommentService;
import com.customchef.backend.service.dto.CommentDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/comments")
public class CommentController implements SecuredRestController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/post/{postId}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<CommentDto> addComment(@PathVariable UUID postId, @RequestBody CommentDto commentDto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findUserByEmail(email).get();

        CommentDto savedCommentDto = commentService.addComment(postId, commentDto, currentUser);
        return new ResponseEntity<>(savedCommentDto, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<String> deleteComment(@PathVariable UUID id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findUserByEmail(email).get();

        commentService.deleteComment(id, currentUser);
        return ResponseEntity.ok("Comment deleted");
    }
}