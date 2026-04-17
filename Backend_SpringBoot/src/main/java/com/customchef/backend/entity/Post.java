package com.customchef.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "post")
public class Post {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User owner;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "recipe_id", referencedColumnName = "id")
    private Recipe recipe;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(length = 1000)
    private String imageUrl;

    public String getImageUrl() { return imageUrl; }
    public Post setImageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }

    public UUID getId() { return id; }
    public Post setId(UUID id) { this.id = id; return this; }

    public User getOwner() { return owner; }
    public Post setOwner(User owner) { this.owner = owner; return this; }

    public Recipe getRecipe() { return recipe; }
    public Post setRecipe(Recipe recipe) { this.recipe = recipe; return this; }

    public List<Comment> getComments() { return comments; }
    public Post setComments(List<Comment> comments) { this.comments = comments; return this; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public Post setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
}