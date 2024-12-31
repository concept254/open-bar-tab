<template>
  <div>
    <h2>Select Beverages</h2>
    <div v-for="beverage in beverages" :key="beverage.id">
      <p>{{ beverage.name }} - R {{ beverage.price.toFixed(2) }}</p>
      <input
        type="number"
        min="0"
        v-model.number="quantities[beverage.id]"
        placeholder="Enter quantity"
      />
    </div>
    <button @click="addToTab">Add to Tab</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useBeverage } from "@/composables/useBeverage";
import { useTab } from "@/composables/useTab";

// Get the list of beverages and the shared tab state
const beverages = useBeverage();
const tab = useTab();

// Reactive object to track quantities for each beverage
const quantities = ref({});

// Function to add beverages to the tab
const addToTab = () => {
  // Map through beverages, filter out items with zero quantity
  const order = beverages
    .map((bev) => ({
      beverage: bev,
      quantity: quantities.value[bev.id] || 0,
    }))
    .filter((order) => order.quantity > 0);

  // Add the order to the shared tab state
  tab.value.push(...order);

  // Reset the quantities after adding to the tab
  quantities.value = {};
};
</script>