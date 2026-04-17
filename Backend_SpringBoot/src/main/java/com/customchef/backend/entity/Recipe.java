package com.customchef.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "recipe")
public class Recipe {
    @Id
    @GeneratedValue
    private UUID id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @Column(name = "is_posted")
    private Boolean isPosted = false;


    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "recipe_ingredients",
            joinColumns = @JoinColumn(name = "recipe_id"),
            inverseJoinColumns = @JoinColumn(name = "ingredient_id"))
    private Set<Ingredient> ingredients = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Boolean getIsPosted() { return isPosted; }
    public Recipe setIsPosted(Boolean isPosted) { this.isPosted = isPosted; return this; }

    public UUID getId() { return id; }
    public Recipe setId(UUID id) { this.id = id; return this; }

    public String getTitle() { return title; }
    public Recipe setTitle(String title) { this.title = title; return this; }

    public String getInstructions() { return instructions; }
    public Recipe setInstructions(String instructions) { this.instructions = instructions; return this; }

    public User getOwner() { return owner; }
    public Recipe setOwner(User owner) { this.owner = owner; return this; }

    public Set<Ingredient> getIngredients() { return ingredients; }
    public Recipe setIngredients(Set<Ingredient> ingredients) { this.ingredients = ingredients; return this; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public Recipe setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
}