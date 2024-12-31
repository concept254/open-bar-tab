<template>
  <div>
    <h2>Split Bill</h2>
    <input
      type="number"
      v-model.number="splitCount"
      placeholder="Split between (optional)"
    />
    <button @click="goToSummary">View Summary</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { navigateTo } from "nuxt/app";

const splitCount = ref(1);

const goToSummary = () => {
  // Pass split count as query parameter
  navigateTo({
    path: "/summary",
    query: { splitCount: splitCount.value },
  });
};
</script>
