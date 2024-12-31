<template>
  <div>
    <h2>Split the Bill</h2>

    <!-- Display total and input for number of people -->
    <div>
      <p><strong>Total Amount:</strong> R {{ totalAmount.toFixed(2) }}</p>

      <label for="numPeople">Number of People:</label>
      <input
        type="number"
        id="numPeople"
        v-model.number="numPeople"
        min="1"
        placeholder="Enter number of people"
      />

      <p v-if="numPeople > 1">
        <strong>Amount per Person:</strong> R {{ amountPerPerson.toFixed(2) }}
      </p>
    </div>

    <!-- Export options -->
    <button @click="exportToCSV">Export as CSV</button>
    <button @click="exportToPDF">Export as PDF</button>
  </div>
</template>

<script setup>
import { useTab } from "@/composables/useTab";

const tab = useTab();
const numPeople = ref(1);

// Calculate total amount
const totalAmount = computed(() => {
  return tab.value.reduce(
    (total, item) => total + item.beverage.price * item.quantity,
    0
  );
});

// Calculate amount per person
const amountPerPerson = computed(() => {
  return totalAmount.value / (numPeople.value || 1);
});

// Export the tab to CSV
function exportToCSV() {
  const rows = [
    ["Beverage", "Quantity", "Price", "Total"],
    ...tab.value.map((item) => [
      item.beverage.name,
      item.quantity,
      item.beverage.price.toFixed(2),
      (item.quantity * item.beverage.price).toFixed(2),
    ]),
    ["", "", "Total", totalAmount.value.toFixed(2)],
  ];

  const csvContent =
    "data:text/csv;charset=utf-8," +
    rows.map((row) => row.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "open_bar_tab.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export the tab to PDF
async function exportToPDF() {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF();
  doc.text("Open Bar Tab", 10, 10);

  let y = 20;
  tab.value.forEach((item) => {
    doc.text(
      `${item.quantity} x ${item.beverage.name} - R ${(
        item.beverage.price * item.quantity
      ).toFixed(2)}`,
      10,
      y
    );
    y += 10;
  });

  doc.text(`Total: R ${totalAmount.value.toFixed(2)}`, 10, y);
  doc.save("open_bar_tab.pdf");
}
</script>

<style scoped>
label {
  display: block;
  margin: 10px 0 5px;
}

input {
  margin-bottom: 15px;
  padding: 5px;
  font-size: 16px;
}

button {
  margin-right: 10px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>