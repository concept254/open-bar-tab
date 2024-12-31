<template>
  <div>
    <h2>Order Summary</h2>
    <!-- Order Details -->
    <div v-for="order in tab" :key="order.beverage.id">
      <p>
        {{ order.beverage.name }} x {{ order.quantity }} = R
        {{ (order.quantity * order.beverage.price).toFixed(2) }}
      </p>
    </div>

    <!-- Total -->
    <p>Total: <b> R {{ total.toFixed(2) }}</b></p>

    </hr>

    <!-- Split Bill Section -->
    <h3>Split Bill</h3>
    <div class="description">
        <p>
            Select the number of people to split the bill
        </p>
    </div>
    <input
      type="number"
      v-model.number="splitCount"
      placeholder="Split between (optional)"
      min="1"
    />
    <p v-if="splitCount > 1">Per Person: R {{ perPersonTotal.toFixed(2) }}</p>

    <!-- Export Buttons -->
    <div class="button-group">
        <button @click="exportToCSV">Export as CSV</button>
        <button @click="exportToPDF">Export as PDF</button>
    </div>
  </div>
</template>

<script setup>
import { useTab } from "@/composables/useTab";
import { useRoute } from "nuxt/app";
import { computed, ref } from "vue";
import jsPDF from "jspdf";
import Papa from "papaparse";

// Shared state
const tab = useTab();
const route = useRoute();

// Split count state
const splitCount = ref(Number(route.query.splitCount) || 1);

// Total computation
const total = computed(() =>
  tab.value.reduce(
    (sum, order) => sum + order.quantity * order.beverage.price,
    0
  )
);

// Per person total
const perPersonTotal = computed(() => (splitCount.value > 1 ? total.value / splitCount.value : total.value));

// Function to export the transaction as CSV
const exportToCSV = () => {
  const csvData = tab.value.map((order) => ({
    Beverage: order.beverage.name,
    Quantity: order.quantity,
    "Price per Unit": `R ${order.beverage.price.toFixed(2)}`,
    Total: `R ${(order.quantity * order.beverage.price).toFixed(2)}`,
  }));

  // Add split and total summary
  csvData.push({ Beverage: "Total", Quantity: "", "Price per Unit": "", Total: `R ${total.value.toFixed(2)}` });
  if (splitCount.value > 1) {
    csvData.push({
      Beverage: "Per Person Total",
      Quantity: "",
      "Price per Unit": "",
      Total: `R ${perPersonTotal.value.toFixed(2)}`,
    });
  }

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "order_summary.csv";
  link.click();
};

// Function to export the transaction as PDF
const exportToPDF = () => {
  const pdf = new jsPDF();

  // Title
  pdf.text("Order Summary", 10, 10);

  // Order details
  tab.value.forEach((order, index) => {
    const yPosition = 20 + index * 10;
    pdf.text(
      `${order.beverage.name} x ${order.quantity} = R ${
        order.quantity * order.beverage.price
      }`,
      10,
      yPosition
    );
  });

  // Add total
  const finalYPosition = 20 + tab.value.length * 10;
  pdf.text(`Total: R ${total.value.toFixed(2)}`, 10, finalYPosition);

  // Add split bill details
  if (splitCount.value > 1) {
    pdf.text(
      `Per Person: R ${perPersonTotal.value.toFixed(2)}`,
      10,
      finalYPosition + 10
    );
  }

  // Save the PDF
  pdf.save("order_summary.pdf");
};
</script>
