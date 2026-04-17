package com.customchef.backend.service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.UUID;

public class CommentDto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;
    private String content;
    private String authorUsername;
    private String authorEmail;

    public UUID getId() { return id; }
    public CommentDto setId(UUID id) { this.id = id; return this; }

    public String getContent() { return content; }
    public CommentDto setContent(String content) { this.content = content; return this; }

    public String getAuthorUsername() { return authorUsername; }
    public CommentDto setAuthorUsername(String authorUsername) { this.authorUsername = authorUsername; return this; }

    public String getAuthorEmail() { return authorEmail; }
    public CommentDto setAuthorEmail(String authorEmail) { this.authorEmail = authorEmail; return this; }
}