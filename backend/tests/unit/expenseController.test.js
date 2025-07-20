// backend/tests/unit/expenseController.test.js
jest.mock('../../db', () => ({
  query: jest.fn()
}));

const pool = require('../../db');
const { getExpenses } = require('../../controllers/expenseController');

function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("Unit Test: Expense Controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getExpenses returns data", async () => {
    const req = {};
    const res = mockResponse();

    const fakeExpenses = [
      { id: 1, title: "Test", amount: 5, category: "Food", date: "2025-06-01" }
    ];

    pool.query.mockResolvedValueOnce({ rows: fakeExpenses });

    await getExpenses(req, res);

    expect(pool.query).toHaveBeenCalledWith("SELECT * FROM expenses ORDER BY date DESC");
    expect(res.json).toHaveBeenCalledWith(fakeExpenses);
  });

  test("getExpenses handles error", async () => {
    const req = {};
    const res = mockResponse();

    pool.query.mockRejectedValueOnce(new Error("DB Failed"));

    await getExpenses(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: "DB Failed"
    }));
  });

});
