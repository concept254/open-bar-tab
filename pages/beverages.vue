<template>
  <div>
    <h2>Select Beverages</h2>
    <div v-for="beverage in beverages" :key="beverage.id">
      <label>{{ beverage.name }} - R {{ beverage.price.toFixed(2) }}</label>
      <input
        type="number"
        min="0"
        v-model.number="quantities[beverage.id]"
        placeholder="Enter quantity"
      />
    </div>
    <div class="button-group">
        <button @click="addToTab">Add to Tab</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useBeverage } from "@/composables/useBeverage";
import { useTab } from "@/composables/useTab";
import { navigateTo } from "nuxt/app";

const beverages = useBeverage();
const tab = useTab();
const quantities = ref({});

const addToTab = () => {
  const order = beverages
    .map((bev) => ({
      beverage: bev,
      quantity: quantities.value[bev.id] || 0,
    }))
    .filter((order) => order.quantity > 0);

  tab.value.push(...order);
  quantities.value = {};

  // Navigate to the split page
  navigateTo("/summary");
};
</script>
