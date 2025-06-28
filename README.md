# Movies App

A **Node.js RESTful API** to manage 🎥 movies and 🎭 actors, supporting user authentication and movie import via text files. The app is fully **Dockerized** for seamless deployment and configuration.

---

## Features

- CRUD operations for movies and actors
- Import movies from `.txt` files
- User registration & JWT-based authentication
- Dockerized for easy setup with environment-based configuration

---

## Requirements

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/) (optional)

---

## Setup & Run

### 1 Clone the repository

```bash
git clone https://github.com/your_super_account/movies-app.git
cd movies-app
```

### 2 Install dependencies

```bash
npm install
```

### 3 Configure environment variables

Create a `.env` file in the root directory:

```env
APP_PORT=8050
SECRET_KEY=your_jwt_secret
EXPIRES_IN=15m
```

### 4 Build the Docker image

```bash
docker build -t your_super_account/movies .
```

### 5 Run the Docker container

```bash
docker run --name movies-app-container -p 8050:8050 -e APP_PORT=8050 your_super_account/movies
```

---

## API Routes & Examples

### Auth Routes

#### Login

```http
POST /api/v1/session
```

```json
{
  "email": "user@example.com",
  "password": "securePassword"
}
```

---

### User Routes

#### 1. Create a new user

```http
POST /api/v1/users
```

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "12345678",
  "confirmPassword": "12345678"
}
```

#### 2. Get all users

```http
GET /api/v1/users
```

#### 3. Get user by ID

```http
GET /api/v1/users/:id
```

#### 4. Update user

```http
PUT /api/v1/users/:id
```

```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

#### 5. Delete user

```http
DELETE /api/v1/users/:id
```

---

### Movies Routes

#### 1. Create a new movie

```http
POST /api/v1/movies
```

```json
{
  "title": "The Matrix",
  "year": 1999,
  "format": "DVD",
  "stars": ["Keanu Reeves", "Laurence Fishburne"]
}
```

#### 2. Get all movies

```http
GET /api/v1/movies
```

#### 3. Get movie by ID

```http
GET /api/v1/movies/:id
```

#### 4. Update movie

```http
PUT /api/v1/movies/:id
```

```json
{
  "title": "Updated Title",
  "year": 2000
}
```

#### 5. Delete movie

```http
DELETE /api/v1/movies/:id
```

#### 6. Import movies from `.txt` file

```http
POST /api/v1/import
Content-Type: multipart/form-data
```

**Form Data Example:**

```
file: movies.txt
```

---

## Example `.txt` Format for Import

```
Title: The Matrix
Release Year: 1999
Format: DVD
Stars: Keanu Reeves, Laurence Fishburne

Title: Inception
Release Year: 2010
Format: Blu-Ray
Stars: Leonardo DiCaprio, Joseph Gordon-Levitt
```
