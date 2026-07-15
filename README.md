# CodeArena - Online Coding Practice & Performance Assessment Platform

CodeArena is a full-stack developer practice platform that allows users to solve coding problems, run automated test cases, compile code in multiple languages, and view detailed progress analytics. 

It is built with a **Spring Boot REST API** backend, a **React (Vite) + Monaco Editor** frontend, and a **MySQL** database.

---

## 🛠️ Tech Stack & Architecture

- **Backend**: Java 17+, Spring Boot, Spring Security (JWT Auth), Spring Data JPA
- **Frontend**: React.js (Vite), CSS3, Monaco Editor (VS Code Editor)
- **Database**: MySQL 8.x
- **Testing**: JUnit 5, Mockito

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed:
1. **Java Development Kit (JDK 17 or higher)**
2. **Node.js (v18 or higher) & npm**
3. **MySQL Server**

---

### 1. Database Setup
Create a database named `codearena` in your MySQL instance:
```sql
CREATE DATABASE codearena;
```

Update your connection credentials in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/codearena?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

---

### 2. Backend Setup & Run
Navigate to the backend directory:
```bash
cd backend
```

Build the project:
```bash
mvn clean compile
```

Run tests to ensure everything is correct:
```bash
mvn test
```

Start the server:
```bash
mvn spring-boot:run
```
The backend server runs at `http://localhost:8081`.

---

### 3. Frontend Setup & Run
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```
The frontend will start at `http://localhost:5173`.

---

## 🔑 Seeding / Default Credentials
On database startup, a default administrator is seeded:
- **Admin Email**: `admin@codearena.com`
- **Admin Password**: `admin`

---

## 💡 Key Features Implemented
1. **Secure Sandbox Code Evaluation**: Whitespace-normalized test output evaluations measuring runtime speed and memory usage.
2. **Admin Problem Management**: Create, Read, Update, and Delete algorithm problems, custom tags, starter codes, and test cases.
3. **Analytics Dashboard**: GitHub-style activity contribution calendar (last 12 weeks) and language proficiency tracking bar charts.
4. **Stateless JWT Security**: Secure route protections on both frontend & backend.
