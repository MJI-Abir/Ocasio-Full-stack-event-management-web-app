# Event Management API

A Spring Boot application for managing events.

## Setup and Configuration

### Environment Variables

The application uses environment variables for configuration. You can set these up by:

1. Copy the `.env.example` file to `.env`
2. Update the values in `.env` with your configuration

Required environment variables:

```
# Database Configuration
DB_URL=jdbc:mysql://localhost:3306/event_management
DB_USERNAME=root
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_secret_key_at_least_32_characters_long
JWT_EXPIRATION=86400000
```

### Running the Application

Make sure MySQL is running on your machine, then:

```bash
# Run the application
./mvnw spring-boot:run
```

## API Documentation

API endpoints will be available at http://localhost:8080 once the application is running.
