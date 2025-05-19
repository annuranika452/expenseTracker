const API_URL = "http://localhost:5000/api/expenses";

async function fetchExpenses() {
  const res = await fetch(API_URL);
  const data = await res.json();
  console.log("Received from backend:", data);
  renderTable(data);
  renderChart(data);
}

function renderTable(expenses) {
  const tbody = document.querySelector("#expense-table tbody");
  tbody.innerHTML = "";

  expenses.forEach(expense => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${expense.title}</td>
      <td>$${expense.amount.toFixed(2)}</td>
      <td>${expense.category}</td>
      <td>${new Date(expense.date).toLocaleDateString()}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderChart(expenses) {
  const ctx = document.getElementById("expense-chart").getContext("2d");

  const totals = {};
  expenses.forEach(({ category, amount }) => {
    totals[category] = (totals[category] || 0) + parseFloat(amount);
  });

  const chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(totals),
      datasets: [{
        label: "Expenses by Category",
        data: Object.values(totals),
        backgroundColor: [
          "#4caf50", "#2196f3", "#ff9800", "#e91e63", "#9c27b0"
        ]
      }]
    }
  });
}

fetchExpenses();
