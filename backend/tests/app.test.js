const request = require("supertest");
const app = require("../app");
const pool = require("../db");

beforeAll(async () => {
  await pool.query("DELETE FROM expenses");
  await pool.query("DELETE FROM users");
});

afterAll(async () => {
  await pool.end();
});

describe("🧪 API Testing", () => {
  test("GET /api/expenses → empty array", async () => {
    const res = await request(app).get("/api/expenses");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  test("POST /api/expenses → add new expense", async () => {
    const expense = {
      title: "Test Coffee",
      amount: "4.99",
      category: "Food",
      date: "2025-06-20"
    };
    const res = await request(app).post("/api/expenses").send(expense);
    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject(expense);
  });

  test("GET /api/expenses → contains added expense", async () => {
    const res = await request(app).get("/api/expenses");
    expect(res.body.some(e => e.title === "Test Coffee")).toBe(true);
  });

  test("DELETE /api/expenses/:id → deletes item", async () => {
    const add = await request(app).post("/api/expenses").send({
      title: "ToDelete",
      amount: "1.00",
      category: "Test",
      date: "2025-06-20"
    });

    const res = await request(app).delete(`/api/expenses/${add.body.id}`);
    expect(res.statusCode).toBe(204);
  });

  test("DELETE non-existing ID → 500 error", async () => {
    const res = await request(app).delete("/api/expenses/999999");
    expect(res.statusCode).toBe(500);
  });
});

describe("🧪 Auth Tests", () => {
  const email = "tester@example.com";
  const password = "testpass123";

  test("Register user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email, password });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
  });

  test("Register duplicate user → error", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email, password });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/already exists/);
  });

  test("Login valid user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email, password });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("Login invalid password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email, password: "wrongpass" });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/Invalid credentials/);
  });

  test("Login unregistered user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nouser@example.com", password: "123456" });
    expect(res.statusCode).toBe(401);
  });
}); 
