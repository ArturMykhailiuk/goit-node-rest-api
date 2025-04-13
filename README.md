# goit-node-rest-api

This is a REST API project built with Node.js and Express. The API provides functionality for managing a collection of contacts, including creating, reading, updating, and deleting contacts.

## Features

- **CRUD Operations**: Create, Read, Update, and Delete contacts.
- **Validation**: Request body validation using schemas.
- **Middleware**: Custom middleware for handling empty request bodies.
- **Error Handling**: Centralized error handling for consistent responses.
- **Modular Structure**: Organized codebase with controllers, routes, and services.

## Contact API Endpoints

### Base URL

http://localhost:3000/api/contacts

### Endpoints

1. Get All Contacts  
   URL: /  
   Method: GET  
   Description: Retrieves a list of all contacts.  
   Response:

```bash
 {
  "id": "1",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890"
}
```

2. Get Contact by ID  
   URL: /:id  
   Method: GET  
   Description: Retrieves a single contact by its ID.  
   Response:

```bash
{
 "id": "1",
 "name": "John Doe",
 "email": "john@example.com",
 "phone": "1234567890"
}
```

3. Create a New Contact  
   URL: /  
   Method: POST  
   Description: Creates a new contact.  
   Request Body:

```bash
{
 "name": "John Doe",
 "email": "john@example.com",
 "phone": "1234567890"
}
```

Response:

```bash
{
  "id": "2",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890"
}
```

4. Update a Contact  
   URL: /:id  
   Method: PUT  
   Description: Updates an existing contact by ID.  
   Request Body:

```bash
{
  "name": "Jane Doe 1"
}
```

Response:

```bash
{
  "id": "1",
  "name": "Jane Doe 1",
  "email": "john@example.com",
  "phone": "1234567890"
}
```

5. Delete a Contact  
   URL: /:id  
   Method: DELETE  
   Description: Deletes a contact by ID.  
   Response:

```bash
{
 "message": "Delete successfully"
}
```

## Contact API Endpoints

### Base URL

http://localhost:3000/api/auth

### Endpoints

1. User Registration  
   URL: /register
   Method: POST  
   Description: Registering of new User.
   Request Body:

```bash
{
  "username": "JohnDoe",
  "email": "john@example.com",
  "password": "password123",
  "subscription": "starter"
}
```

Response:

```bash
{
  "id": "1",
  "username": "JohnDoe",
  "email": "john@example.com",
  "subscription": "starter"
}
```

2. User Login  
   URL: /login
   Method: POST
   Description: User Login
   Request Body:

```bash
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```bash
{
  "token": "some-valid-token",
  "user": {
    "email": "john@example.com",
    "subscription": "starter"
   }
}
```

3. Get Current User
   URL: /current
   Method: GET
   Description: Get Current Authorized User
   Headers:

```bash
{
  "Authorization": "Bearer <valid-token>"
}
```

Response:

```bash
{
  "username": "JohnDoe",
  "email": "john@example.com",
  "subscription": "starter"
}
```

4. Update User Subscription
   URL: /subscription
   Method: PATCH
   Description: Update user subscription
   Headers:

```bash
{
  "Authorization": "Bearer <valid-token>"
}
```

Request Body:

```bash
{
  "subscription": "pro"
}
```

Response:

```bash
{
  "message": "Subscription updated successfully",
  "user": {
    "id": "1",
    "username": "JohnDoe",
    "email": "john@example.com",
    "subscription": "pro"
  }
}
```
