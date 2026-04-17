package com.customchef.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

import java.util.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue
    private UUID id;

    private String username;
    private String password;
    private String email;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private List<Role> roles = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "user_friends",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "friend_id"))
    private Set<User> friends = new HashSet<>();


    public UUID getId() { return id; }
    public User setId(UUID id) { this.id = id; return this; }

    public String getUsername() { return username; }

    public User setUsername(String username) { this.username = username; return this; }

    public String getPassword() { return password; }
    public User setPassword(String password) { this.password = password; return this; }

    public String getEmail() { return email; }
    public User setEmail(String email) { this.email = email; return this; }

    public List<Role> getRoles() { return roles; }
    public User setRoles(List<Role> roles) { this.roles = roles; return this; }

    public Set<User> getFriends() { return friends; }
    public User setFriends(Set<User> friends) { this.friends = friends; return this; }
}
