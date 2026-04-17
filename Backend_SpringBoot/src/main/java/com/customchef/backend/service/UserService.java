package com.customchef.backend.service;

import com.customchef.backend.entity.User;
import com.customchef.backend.exception.BadRequestException;
import com.customchef.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.customchef.backend.service.dto.UserDto;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;


    @Transactional(readOnly = true)
    public UserDto getUserProfile(UUID targetId, String currentUserEmail) {
        User targetUser = userRepository.findById(targetId)
                .orElseThrow(() -> new BadRequestException("User not found"));

        User currentUser = userRepository.findUserByEmail(currentUserEmail)
                .orElse(null);

        return convertToDto(targetUser, currentUser);
    }

    @Transactional(readOnly = true)
    public List<UserDto> getMyFriends(String email) {
        User currentUser = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        return currentUser.getFriends().stream()
                .map(friend -> convertToDto(friend, currentUser))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UserDto> searchUsers(String query, String searcherEmail) {
        User currentUser = userRepository.findUserByEmail(searcherEmail)
                .orElseThrow(() -> new BadRequestException("User not found"));

        return userRepository.findByUsernameContainingIgnoreCase(query).stream()
                .filter(user -> !user.getId().equals(currentUser.getId()))
                .map(user -> convertToDto(user, currentUser))
                .toList();
    }

    public UserDto convertToDto(User userToConvert, User currentUser) {
        boolean isFollowed = false;

        if (currentUser != null && currentUser.getFriends() != null) {
            isFollowed = currentUser.getFriends().contains(userToConvert);
        }

        return new UserDto()
                .setId(userToConvert.getId())
                .setUsername(userToConvert.getUsername())
                .setEmail(userToConvert.getEmail())
                .setIsFollowed(isFollowed);
    }


    public void followUser(String currentUserEmail, UUID targetUserId) {
        User currentUser = userRepository.findUserByEmail(currentUserEmail)
                .orElseThrow(() -> new BadRequestException("Current user not found"));

        if (currentUser.getId().equals(targetUserId)) {
            throw new BadRequestException("You cannot follow yourself");
        }

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new BadRequestException("User not found"));

        currentUser.getFriends().add(targetUser);
        userRepository.save(currentUser);
    }

    public void unfollowUser(String currentUserEmail, UUID targetUserId) {
        User currentUser = userRepository.findUserByEmail(currentUserEmail)
                .orElseThrow(() -> new BadRequestException("Current user not found"));

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new BadRequestException("Target user not found"));

        currentUser.getFriends().remove(targetUser);
        userRepository.save(currentUser);
    }
}