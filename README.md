# 📦 Order Service (Node.js + MySQL + Docker)

A backend **Order Service** built using **Node.js**, **Express**, and **MySQL**, designed with a clean MVC structure and containerized using **Docker**. This project is part of an **event‑driven system roadmap** (Kafka planned next).

---

## 🚀 Tech Stack

* **Node.js**
* **Express.js**
* **MySQL 8**
* **Docker & Docker Desktop**
* **MVC Architecture**
* **REST APIs**

---

## 📂 Project Structure

```
order-service/
│
├── src/
│   ├── controllers/
│   │   └── order.controller.js
│   ├── routes/
│   │   └── order.routes.js
│   ├── models/
│   │   └── order.model.js
│   ├── db/
│   │   └── mysql.js
│   └── app.js
│
├── Dockerfile
├── package.json
├── package-lock.json
└── README.md
```

---

## 🔁 API Flow (High Level)

```mermaid
flowchart LR
    Client -->|HTTP Request| Express
    Express --> Routes
    Routes --> Controller
    Controller --> Model
    Model --> MySQL[(MySQL DB)]
    MySQL --> Model
    Model --> Controller
    Controller --> Client
```

---

## 🔗 REST API Endpoints

| Method | Endpoint          | Description        |
| ------ | ----------------- | ------------------ |
| POST   | `/api/orders`     | Create a new order |
| GET    | `/api/orders`     | Get all orders     |
| GET    | `/api/orders/:id` | Get order by ID    |
| PUT    | `/api/orders/:id` | Update order by ID |
| DELETE | `/api/orders/:id` | Delete order by ID |

> Same endpoint with different HTTP methods is **REST standard practice**.

---

## 🧠 Controller Flow (Example: Get Order by ID)

```mermaid
flowchart TD
    A[Client Request /api/orders/:id] --> B[Route Layer]
    B --> C[Controller: getOrderById]
    C --> D[Model: DB Query]
    D --> E{Order Exists?}
    E -- Yes --> F[Return Order]
    E -- No --> G[Return 404 Not Found]
```

---

## 🐳 Docker Architecture

```mermaid
flowchart LR
    NodeContainer[Node.js Container]
    MySQLContainer[MySQL Container]

    NodeContainer -->|3306| MySQLContainer
    Browser -->|3000| NodeContainer
```

### Important Docker Rules

* Containers **communicate using container names**, not `localhost`
* MySQL **always runs on port 3306 inside Docker**
* Host port (e.g. 3307) is only for local machine access
* Data is persistent using Docker volumes

---

## 🐬 MySQL Connection (Sanitized)

* Host: `mysql` (container name)
* Port: `3306`
* Credentials: **stored via environment variables (recommended)**

> Sensitive data like passwords and secrets are intentionally excluded.

---

## 🧱 Database Strategy

✔ Tables are not auto-created
✔ Tables created using migration SQL
✔ Data persists using Docker volumes
✔ Tables are NOT recreated on container restart
✔ Only recreated if volume is deleted

---

## ▶️ Running the Project (Docker)

1. Start Docker Desktop
2. Build Node image
3. Run MySQL container
4. Run Node container
5. Test APIs using browser or curl

Example:

```
curl http://localhost:3000/api/orders
```

---

## ❗ Common Issues & Fixes

### ❌ DB Connection Error

* Ensure MySQL container is running
* Ensure database exists
* Ensure Node uses `host: mysql`
* Restart container after config changes

---

## 🔮 Future Enhancements

* Kafka integration (event‑driven order processing)
* Authentication (JWT)
* Order status events (CREATED, CONFIRMED, CANCELLED)
* Logging & monitoring

---

## 👨‍💻 Author

**Abhishek Singh**
Backend Developer (Node.js | MySQL | Docker  )

---

## ⭐ Notes

This README is designed to be:

* Easy to extend as the system grows

Kafka & advanced system‑design notes will be added later.
