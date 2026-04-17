package com.customchef.backend.repository;

import com.customchef.backend.entity.Recipe;
import com.customchef.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, UUID> {
    List<Recipe> findByOwner(User owner);
    List<Recipe> findByTitleContainingIgnoreCase(String title);
    List<Recipe> findAllByOwner(User owner);

    Page<Recipe> findByOwner(User owner, Pageable pageable);
    Page<Recipe> findByOwnerAndTitleContainingIgnoreCase(User owner, String title, Pageable pageable);
}