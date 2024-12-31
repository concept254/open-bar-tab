<template>
  <div>
    <h2>Order Summary</h2>
    <!-- Loop through the tab to display each order -->
    <div v-for="order in tab" :key="order.beverage.id">
      <p>
        {{ order.beverage.name }} x {{ order.quantity }} = R
        {{ (order.quantity * order.beverage.price).toFixed(2) }}
      </p>
    </div>
    <p>Total: R {{ total.toFixed(2) }}</p>
    <input
      type="number"
      v-model.number="splitCount"
      placeholder="Split between (optional)"
    />
    <p v-if="splitCount > 1">
      Per Person: R {{ (total / splitCount).toFixed(2) }}
    </p>
    <button @click="exportTab">Export Tab</button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useTab } from "@/composables/useTab";
import jsPDF from "jspdf";
import Papa from "papaparse";

// Access the shared tab state using useTab
const tab = useTab();

// Local state for splitting the bill
const splitCount = ref(1);

// Compute the total amount
const total = computed(() =>
  tab.value.reduce(
    (sum, order) => sum + order.quantity * order.beverage.price,
    0
  )
);

// Function to export the tab
const exportTab = () => {
  // Export to CSV
  const csvData = tab.value.map((order) => ({
    Beverage: order.beverage.name,
    Quantity: order.quantity,
    Price: `R ${order.beverage.price.toFixed(2)}`,
    Total: `R ${(order.quantity * order.beverage.price).toFixed(2)}`,
  }));
  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "tab.csv";
  link.click();

  // Export to PDF
  const pdf = new jsPDF();
  pdf.text("Order Summary", 10, 10);
  tab.value.forEach((order, index) => {
    pdf.text(
      `${order.beverage.name} x ${order.quantity} = R ${
        order.quantity * order.beverage.price
      }`,
      10,
      20 + index * 10
    );
  });
  pdf.text(`Total: R ${total.value.toFixed(2)}`, 10, 20 + tab.value.length * 10);
  pdf.save("tab.pdf");
};
</script>