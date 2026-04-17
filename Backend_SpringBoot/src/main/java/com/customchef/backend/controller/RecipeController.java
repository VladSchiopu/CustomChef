package com.customchef.backend.controller;

import com.customchef.backend.entity.User;
import com.customchef.backend.repository.UserRepository;
import com.customchef.backend.service.RecipeService;
import com.customchef.backend.service.dto.RecipeDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.customchef.backend.service.dto.PagedResponse;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/recipes")
public class RecipeController implements SecuredRestController {

    @Autowired
    private RecipeService recipeService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<RecipeDto> createRecipe(@RequestBody RecipeDto recipeDto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findUserByEmail(email).get();

        return new ResponseEntity<>(recipeService.saveRecipeWithIngredients(recipeDto, currentUser), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeDto> getRecipeById(@PathVariable UUID id) {
        return ResponseEntity.ok(recipeService.getRecipeDtoById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<RecipeDto> updateRecipe(@PathVariable UUID id, @RequestBody RecipeDto recipeDto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findUserByEmail(email).get();

        return ResponseEntity.ok(recipeService.updateRecipe(id, recipeDto, currentUser));
    }

    @GetMapping("/my-recipes")
    public ResponseEntity<PagedResponse<RecipeDto>> getMyRecipes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String searchTitle) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<RecipeDto> pageResult = recipeService.getRecipesByOwner(email, searchTitle, pageable);

        return ResponseEntity.ok(new PagedResponse<>(
                pageResult.getContent(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages()
        ));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteRecipe(@PathVariable UUID id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findUserByEmail(email).get();

        recipeService.deleteRecipe(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}