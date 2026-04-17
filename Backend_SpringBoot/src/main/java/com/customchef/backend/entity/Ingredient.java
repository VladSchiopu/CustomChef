package com.customchef.backend.entity;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "ingredient")
public class Ingredient {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(unique = true)
    private String name;

    public UUID getId() { return id; }
    public Ingredient setId(UUID id) { this.id = id; return this; }

    public String getName() { return name; }
    public Ingredient setName(String name) { this.name = name; return this; }
}