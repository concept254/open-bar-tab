<template>
  <div>
    <h1>Betway Open Bar</h1>
    <div class="description">
        <p>
            Welcome to the Betway open bar tab application
        </p>
    </div>
    <button @click="navigateToBeverages">Start Ordering Beverages</button>
  </div>
</template>

<script setup>
import { navigateTo } from "nuxt/app";

const navigateToBeverages = () => {
  navigateTo("/beverages");
};
</script>
