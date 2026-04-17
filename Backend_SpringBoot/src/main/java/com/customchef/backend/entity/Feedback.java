package com.customchef.backend.entity;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "feedback")
public class Feedback {
    @Id @GeneratedValue private UUID id;
    @ManyToOne @JoinColumn(name = "user_id") private User user;
    private String source;
    private Integer rating;
    private Boolean hadProblems;
    @Column(columnDefinition = "TEXT") private String suggestions;

    public UUID getId() { return id; }
    public Feedback setId(UUID id) { this.id = id; return this; }
    public User getUser() { return user; }
    public Feedback setUser(User user) { this.user = user; return this; }
    public String getSource() { return source; }
    public Feedback setSource(String source) { this.source = source; return this; }
    public Integer getRating() { return rating; }
    public Feedback setRating(Integer rating) { this.rating = rating; return this; }
    public Boolean getHadProblems() { return hadProblems; }
    public Feedback setHadProblems(Boolean hadProblems) { this.hadProblems = hadProblems; return this; }
    public String getSuggestions() { return suggestions; }
    public Feedback setSuggestions(String suggestions) { this.suggestions = suggestions; return this; }
}