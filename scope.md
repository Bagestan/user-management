Dear Andre,

We really appreciated your performance in the previous stages of our selection process — congratulations on successfully moving forward! 🎉

As the next step, we’d like to invite you to complete a backend challenge. This exercise is designed to assess how you approach backend system design and how you structure your thinking within a scalable and maintainable architecture.

NestJS Technical Code Challenge

🎯 Objective

    Build a NestJS monorepo backend using the apps/ structure. You must create two apps:
    apps/gateway: exposes a public HTTP REST API.
    apps/authentication: a microservice responsible for user management.

The two apps must communicate internally via TCP using NestJS Microservices and a NetworkingService.

The challenge is intended to evaluate your ability to:

    Organize a monorepo.
    Structure feature code into modules using MVC patterns (Controller, Service, Repository).
    Use DTOs, RTOs, request/response patterns.
    Integrate microservices using internal message passing (via TCP).
    Apply NestJS ecosystem patterns such as validation, Swagger, caching, and Dockerization.

✅ Requirements

🏗️ Project Architecture

Use a modular NestJS Monorepo.

Structure the project to match:

    apps/
    gateway/
    authentication/
    common/
    core/
    config/

Do NOT use Clean or Hexagonal Architecture. Stick to Controller → Service → Repository.

Implement all HTTP logic in apps/gateway.

Implement all business logic and persistence in apps/authentication.

📦 Feature: User Management (Example Use Case)

Implement the following endpoints in the Gateway:

    POST /auth/register → Register a new user
    GET /auth/users → Get all users
    In Authentication service, handle the logic and persistence for:
    Registering a user.
    Listing all users.
    Use TCP messaging to forward requests from gateway to microservice.

✅ Mandatory Features

    Validation: Use class-validator and DTOs for request validation.
    Database: Use MongoDB (Mongoose) or another database of your choice.
    Microservices.

Use @nestjs/microservices to connect gateway with authentication.

🧩 Suggested Bonus Features (Optional)

    JWT-based login flow.
    Centralized logging module.
    Test coverage (unit/e2e).
    Health checks or readiness probes.
    Rate limiting or throttling.

📹 Video Walkthrough (Required)

    Record a 5–15 minute Loom/Vidyard (or similar) walkthrough:
    Brief introduction (name, background).
    Explain your file structure and architectural decisions.
    Walk through core code: controllers, services, DTOs, networking.
    Demonstrate the API using Apidog/Postman.
    Show Docker setup if applicable.

📬 What to Submit

    ✅ GitHub repository link (public).
    ✅ Video walkthrough link.
    (Optional) Postman/Apidog collection.
    (Optional) README or extra documentation.

⏱ Time Limit

You have 48 hours from the moment we confirm your participation.

🧠 Notes & Tips

    We value clarity, structure, and maintainability over complexity.
    You are encouraged to use open-source libraries.
    Do not use proprietary or previous employer code.
    This helps us better understand your approach and thought process.

Please let us know if you have any questions. We look forward to seeing your work!

Best regards,

Stefano Gjini

Aladia Corp.
