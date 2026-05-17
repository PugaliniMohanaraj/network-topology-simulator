# Build from repo root: docker build -f network-simulator/Dockerfile .
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY network-simulator network-simulator/
RUN mvn -q -f pom.xml -pl network-simulator -am dependency:go-offline -DskipTests
RUN mvn -q -f pom.xml -pl network-simulator -am package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/network-simulator/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
