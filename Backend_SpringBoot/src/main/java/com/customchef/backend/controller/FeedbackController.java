package com.customchef.backend.controller;

import com.customchef.backend.entity.Feedback;
import com.customchef.backend.entity.User;
import com.customchef.backend.repository.FeedbackRepository;
import com.customchef.backend.repository.UserRepository;
import com.customchef.backend.service.dto.FeedbackDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/feedback")
public class FeedbackController implements SecuredRestController {

    @Autowired private FeedbackRepository feedbackRepository;
    @Autowired private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<String> submitFeedback(@RequestBody FeedbackDto dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findUserByEmail(email).orElseThrow();

        Feedback feedback = new Feedback()
                .setUser(user)
                .setSource(dto.getSource())
                .setRating(dto.getRating())
                .setHadProblems(dto.getHadProblems())
                .setSuggestions(dto.getSuggestions());

        feedbackRepository.save(feedback);
        return ResponseEntity.ok("Feedback sent");
    }
}