package com.customchef.backend.repository;

import com.customchef.backend.entity.Comment;
import com.customchef.backend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {
    List<Comment> findByPostOrderByContentAsc(Post post);
}