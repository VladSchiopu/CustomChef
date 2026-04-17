package com.customchef.backend.controller;

import com.customchef.backend.entity.User;
import com.customchef.backend.repository.UserRepository;
import com.customchef.backend.service.UserService;
import com.customchef.backend.service.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class UserController implements SecuredRestController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDto dto = new UserDto()
                .setId(user.getId())
                .setUsername(user.getUsername())
                .setEmail(user.getEmail());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserProfile(@PathVariable UUID id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        return ResponseEntity.ok(userService.getUserProfile(id, email));
    }

    @PostMapping("/follow/{targetId}")
    public ResponseEntity<String> follow(@PathVariable UUID targetId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        userService.followUser(email, targetId);
        return ResponseEntity.ok("Followed successfully");
    }

    @PostMapping("/unfollow/{targetId}")
    public ResponseEntity<String> unfollow(@PathVariable UUID targetId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        userService.unfollowUser(email, targetId);
        return ResponseEntity.ok("Unfollowed successfully");
    }

    @GetMapping("/my-friends")
    public ResponseEntity<List<UserDto>> getMyFriends() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(userService.getMyFriends(email));
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDto>> search(@RequestParam String name) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(userService.searchUsers(name, email));
    }
}