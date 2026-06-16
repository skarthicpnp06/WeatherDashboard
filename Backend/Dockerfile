# Step 1: Build the jar using Maven and official Eclipse Temurin image
FROM maven:3.9.6-eclipse-temurin-17 AS build
COPY . .
RUN mvn clean package -DskipTests

# Step 2: Use the official lightweight Eclipse Temurin runtime image
FROM eclipse-temurin:17-jre-jammy
COPY --from=build /target/Backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]