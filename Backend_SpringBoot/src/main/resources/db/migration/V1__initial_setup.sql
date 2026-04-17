CREATE SCHEMA IF NOT EXISTS project;
SET search_path = project, pg_catalog;

CREATE SEQUENCE roles_seq START WITH 3 INCREMENT BY 1;

CREATE TABLE roles (
                       id integer PRIMARY KEY,
                       name text NOT NULL
);

CREATE TABLE users (
                       id uuid PRIMARY KEY,
                       username text NOT NULL UNIQUE,
                       email text NOT NULL UNIQUE,
                       password text NOT NULL
);

CREATE TABLE ingredient (
                            id uuid PRIMARY KEY,
                            name text NOT NULL UNIQUE
);

CREATE TABLE recipe (
                        id uuid PRIMARY KEY,
                        title text NOT NULL,
                        instructions text,
                        owner_id uuid REFERENCES users(id) ON DELETE CASCADE,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        is_posted BOOLEAN DEFAULT FALSE
);

CREATE TABLE post (
                      id uuid PRIMARY KEY,
                      user_id uuid REFERENCES users(id) ON DELETE CASCADE,
                      recipe_id uuid UNIQUE REFERENCES recipe(id) ON DELETE CASCADE,
                      image_url text,
                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comment (
                         id uuid PRIMARY KEY,
                         content text NOT NULL,
                         user_id uuid REFERENCES users(id) ON DELETE CASCADE,
                         post_id uuid REFERENCES post(id) ON DELETE CASCADE
);

CREATE TABLE user_roles (
                            user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                            role_id integer NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
                            PRIMARY KEY (user_id, role_id)
);

CREATE TABLE user_friends (
                              user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                              friend_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                              PRIMARY KEY (user_id, friend_id),
                              CHECK (user_id <> friend_id)
);

CREATE TABLE recipe_ingredients (
                                    recipe_id uuid NOT NULL REFERENCES recipe(id) ON DELETE CASCADE,
                                    ingredient_id uuid NOT NULL REFERENCES ingredient(id) ON DELETE CASCADE,
                                    PRIMARY KEY (recipe_id, ingredient_id)
);

CREATE TABLE feedback (
                          id uuid PRIMARY KEY,
                          user_id uuid REFERENCES users(id) ON DELETE CASCADE,
                          source text NOT NULL,
                          rating integer NOT NULL,
                          had_problems boolean NOT NULL,
                          suggestions text
);

INSERT INTO roles (id, name) VALUES (1, 'ADMIN'), (2, 'USER');