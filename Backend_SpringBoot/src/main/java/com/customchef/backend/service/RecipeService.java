package com.customchef.backend.service;

import com.customchef.backend.entity.Ingredient;
import com.customchef.backend.entity.Recipe;
import com.customchef.backend.entity.User;
import com.customchef.backend.exception.BadRequestException;
import com.customchef.backend.repository.IngredientRepository;
import com.customchef.backend.repository.RecipeRepository;
import com.customchef.backend.repository.UserRepository;
import com.customchef.backend.service.dto.RecipeDto;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class RecipeService {

    @Autowired
    private IngredientRepository ingredientRepository;
    @Autowired
    private RecipeRepository recipeRepository;
    @Autowired
    private UserRepository userRepository;

    public Recipe saveRecipeEntity(RecipeDto dto, User owner) {
        Recipe recipe = new Recipe()
                .setTitle(dto.getTitle())
                .setInstructions(dto.getInstructions())
                .setOwner(owner);

        recipe.setIngredients(processIngredients(dto.getIngredients()));
        return recipeRepository.save(recipe);
    }

    private Recipe getById(UUID id) {
        return recipeRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Recipe not found with id: " + id));
    }

    public RecipeDto convertToDto(Recipe recipe) {
        String ingredientNames = recipe.getIngredients().stream()
                .map(Ingredient::getName)
                .collect(Collectors.joining(", "));

        return new RecipeDto()
                .setId(recipe.getId())
                .setTitle(recipe.getTitle())
                .setInstructions(recipe.getInstructions())
                .setIngredients(ingredientNames)
                .setAuthorName(recipe.getOwner().getUsername())
                .setCreatedAt(recipe.getCreatedAt())
                .setIsPosted(recipe.getIsPosted());
    }

    public Page<RecipeDto> getRecipesByOwner(String email, String searchTitle, Pageable pageable) {
        User user = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        Page<Recipe> recipes;
        if (searchTitle != null && !searchTitle.trim().isEmpty()) {
            recipes = recipeRepository.findByOwnerAndTitleContainingIgnoreCase(user, searchTitle.trim(), pageable);
        } else {
            recipes = recipeRepository.findByOwner(user, pageable);
        }

        return recipes.map(this::convertToDto);
    }

    public RecipeDto getRecipeDtoById(UUID id) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Recipe not found with id: " + id));
        return convertToDto(recipe);
    }

    public RecipeDto saveRecipeWithIngredients(RecipeDto dto, User owner) {
        Recipe recipe = new Recipe()
                .setTitle(dto.getTitle())
                .setInstructions(dto.getInstructions())
                .setOwner(owner);

        recipe.setIngredients(processIngredients(dto.getIngredients()));
        Recipe saved = recipeRepository.save(recipe);
        return convertToDto(saved);
    }

    public RecipeDto updateRecipe(UUID id, RecipeDto dto, User currentUser) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Recipe not found"));

        if (!recipe.getOwner().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You are not the owner of this recipe");
        }

        recipe.setTitle(dto.getTitle());
        recipe.setInstructions(dto.getInstructions());

        if (dto.getIngredients() != null) {
            recipe.setIngredients(processIngredients(dto.getIngredients()));
        }

        Recipe updated = recipeRepository.save(recipe);
        return convertToDto(updated);
    }

    @Transactional
    public void deleteRecipe(UUID id, User currentUser) {
        Recipe recipe = getById(id);

        boolean isAdmin = currentUser.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ADMIN"));

        if (!recipe.getOwner().getId().equals(currentUser.getId()) && !isAdmin) {
            throw new BadRequestException("You don't have permission to delete this recipe");
        }

        recipeRepository.delete(recipe);
    }

    private Set<Ingredient> processIngredients(String ingredientsString) {
        if (ingredientsString == null || ingredientsString.isEmpty()) {
            return new HashSet<>();
        }

        String[] ingredientNames = ingredientsString.split(",");
        Set<Ingredient> ingredientSet = new HashSet<>();

        for (String name : ingredientNames) {
            String cleanName = name.trim().toLowerCase();
            if (cleanName.isEmpty()) continue;

            Ingredient ingredient = ingredientRepository.findByNameIgnoreCase(cleanName)
                    .orElseGet(() -> ingredientRepository.save(new Ingredient().setName(cleanName)));

            ingredientSet.add(ingredient);
        }
        return ingredientSet;
    }
}