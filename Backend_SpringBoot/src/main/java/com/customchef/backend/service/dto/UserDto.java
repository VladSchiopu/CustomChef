package com.customchef.backend.service.dto;

import java.util.UUID;

public class UserDto {
    private UUID id;
    private String username;
    private String email;
    private Boolean isFollowed;

    public Boolean getIsFollowed() { return isFollowed; }
    public UserDto setIsFollowed(Boolean isFollowed) { this.isFollowed = isFollowed; return this; }

    public UUID getId() { return id; }
    public UserDto setId(UUID id) { this.id = id; return this; }

    public String getUsername() { return username; }
    public UserDto setUsername(String username) { this.username = username; return this; }

    public String getEmail() { return email; }
    public UserDto setEmail(String email) { this.email = email; return this; }
}