package com.customchef.backend.service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.UUID;

public class RecipeDto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;
    private String title;
    private String instructions;
    private String ingredients;
    private String authorName;
    private LocalDateTime createdAt;
    private Boolean isPosted;

    public Boolean getIsPosted() { return isPosted; }
    public RecipeDto setIsPosted(Boolean isPosted) { this.isPosted = isPosted; return this; }

    public UUID getId() { return id; }
    public RecipeDto setId(UUID id) { this.id = id; return this; }

    public String getTitle() { return title; }
    public RecipeDto setTitle(String title) { this.title = title; return this; }

    public String getInstructions() { return instructions; }
    public RecipeDto setInstructions(String instructions) { this.instructions = instructions; return this; }

    public String getIngredients() { return ingredients; }
    public RecipeDto setIngredients(String ingredients) { this.ingredients = ingredients; return this; }

    public String getAuthorName() { return authorName; }
    public RecipeDto setAuthorName(String authorName) { this.authorName = authorName; return this; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public RecipeDto setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
}