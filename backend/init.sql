CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  amount NUMERIC(10, 2),
  category VARCHAR(100),
  date DATE
);
