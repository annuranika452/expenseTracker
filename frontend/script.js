let chartInstance = null;

const API_URL = "http://localhost:5050/api/expenses";

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
      <td>$${parseFloat(expense.amount).toFixed(2)}</td>
      <td>${expense.category}</td>
      <td>${new Date(expense.date).toLocaleDateString()}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderChart(expenses) {
  if (chartInstance) {
    chartInstance.destroy(); // Clear the previous chart
  }

  const ctx = document.getElementById("expense-chart").getContext("2d");

  const totals = {};
  expenses.forEach(({ category, amount }) => {
    totals[category] = (totals[category] || 0) + parseFloat(amount);
  });

  chartInstance = new Chart(ctx, {
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

document.getElementById("expense-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent page reload

  const title = document.getElementById("title").value;
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;

  const expense = { title, amount, category, date };

  try {
    const res = await fetch("http://localhost:5050/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense),
    });

    if (res.ok) {
      document.getElementById("expense-form").reset();
      fetchExpenses(); // Refresh table and chart
    } else {
      alert("Failed to add expense");
    }
  } catch (err) {
    alert("Error: " + err.message);
  }
});

document.getElementById("upload-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("receipt");
  const formData = new FormData();
  formData.append("image", fileInput.files[0]);

  const res = await fetch("http://localhost:5050/api/ocr", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  console.log("OCR Result:", data);

});

