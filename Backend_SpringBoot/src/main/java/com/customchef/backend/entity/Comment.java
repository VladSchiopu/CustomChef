package com.customchef.backend.entity;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "comment")
public class Comment {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;

    public UUID getId() { return id; }
    public Comment setId(UUID id) { this.id = id; return this; }

    public String getContent() { return content; }
    public Comment setContent(String content) { this.content = content; return this; }

    public User getAuthor() { return author; }
    public Comment setAuthor(User author) { this.author = author; return this; }

    public Post getPost() { return post; }
    public Comment setPost(Post post) { this.post = post; return this; }
}