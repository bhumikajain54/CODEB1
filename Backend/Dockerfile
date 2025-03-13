# Use an official Maven image to build the Spring Boot app
FROM maven:3.8.4-openjdk-17 AS build

# Set the working directory
WORKDIR /app

# Copy the pom.xml and install dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Use an official OpenJDK image to run the application
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

#Copy the built Jar file from the build stage
COPY --from=build /app/target/demo-0.0.1-SNAPSHOT.jar .

# Expose port 8080
EXPOSE 8080

# Specify the command to run the application
ENTRYPOINT ["java", "-jar","/app/demo-0.0.1-SNAPSHOT.jar"]

#how to add below code in above code
# Set environment variables
ENV DATASOURCE_URL=jdbc:mysql://mysql-2ae78166-jainbhumika54-bdc3.d.aivencloud.com:21772/mis_invoicing
ENV DATASOURCE_USER=avnadmin
ENV DATASOURCE_PASSWORD=AVNS_FcjeIAOTBExBUWl0J0_
ENV FRONTEND_URL=http://localhost:3000