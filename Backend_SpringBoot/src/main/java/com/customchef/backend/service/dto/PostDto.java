package com.customchef.backend.service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class PostDto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;
    private String authorUsername;
    private String authorEmail;
    private RecipeDto recipe;
    private List<CommentDto> comments;
    private LocalDateTime createdAt;
    private String imageUrl;
    private Boolean authorIsFollowed;

    public Boolean getAuthorIsFollowed() { return authorIsFollowed; }
    public PostDto setAuthorIsFollowed(Boolean authorIsFollowed) { this.authorIsFollowed = authorIsFollowed; return this; }

    public String getImageUrl() { return imageUrl; }
    public PostDto setImageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }

    public String getAuthorEmail() { return authorEmail; }
    public PostDto setAuthorEmail(String authorEmail) { this.authorEmail = authorEmail; return this; }

    public UUID getId() { return id; }
    public PostDto setId(UUID id) { this.id = id; return this; }

    public String getAuthorUsername() { return authorUsername; }
    public PostDto setAuthorUsername(String authorUsername) { this.authorUsername = authorUsername; return this; }

    public RecipeDto getRecipe() { return recipe; }
    public PostDto setRecipe(RecipeDto recipe) { this.recipe = recipe; return this; }

    public List<CommentDto> getComments() { return comments; }
    public PostDto setComments(List<CommentDto> comments) { this.comments = comments; return this; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public PostDto setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
}