// backend/tests/whitebox/expenseLogic.test.js
const { getExpenses } = require("../../controllers/expenseController");

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

describe("🧠 White Box: Expense logic", () => {
  beforeEach(() => jest.clearAllMocks());

  test("getExpenses handles DB failure", async () => {
    const req = {};
    const res = mockRes();

    db.query.mockRejectedValueOnce(new Error("DB down"));

    await getExpenses(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: "DB down" }));
  });
});
