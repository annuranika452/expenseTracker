// backend/tests/whitebox/authLogic.test.js
const { registerUser, loginUser } = require("../../controllers/authController");

jest.mock("../../db", () => ({
  query: jest.fn()
}));

const db = require("../../db");

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
}

describe("🧠 White Box: AuthController internal logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("registerUser: handles existing user check logic", async () => {
    const req = {
      body: { email: "test@example.com", password: "secret123" }
    };
    const res = mockRes();

    db.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

    await registerUser(req, res);

    expect(db.query).toHaveBeenCalledWith("SELECT * FROM users WHERE email = $1", [req.body.email]);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "User already exists" });
  });

  test("loginUser: fails if user not found", async () => {
    const req = {
      body: { email: "notfound@example.com", password: "wrong" }
    };
    const res = mockRes();

    db.query.mockResolvedValueOnce({ rows: [] });

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
  });
});
