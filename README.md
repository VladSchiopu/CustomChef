# CustomChef
Full-Stack Cooking Platform in Spring Boot and React

# How to run the app

## Run the Backend
Open docker desktop.

docker-compose -f .\docker-compose.yml -p mobylab-app-db up -d

mvn clean install

mvn spring-boot:run

Open a browser tab and type this URL for the Swagger: http://localhost:8091/swagger-ui/index.html#/

## Run the Frontend

npm run generate-api

npm run dev
