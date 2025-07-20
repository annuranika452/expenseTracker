// backend/tests/unit/authController.test.js
jest.mock('../../db', () => ({
  query: jest.fn()
}));

const pool = require('../../db');
const { registerUser, loginUser } = require('../../controllers/authController');

// helper to mock req/res
function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("Unit Test: Auth Controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("registerUser with new email → returns 201", async () => {
    const req = {
      body: { email: "unit1@example.com", password: "123456" }
    };
    const res = mockResponse();

    pool.query
      .mockResolvedValueOnce({ rows: [] }) // no user exists
      .mockResolvedValueOnce({});          // insert success

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: "User registered successfully"
    }));
  });

  test("registerUser with existing email → returns 400", async () => {
    const req = {
      body: { email: "unit1@example.com", password: "123456" }
    };
    const res = mockResponse();

    pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: "User already exists"
    }));
  });

});
