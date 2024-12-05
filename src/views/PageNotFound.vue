<script lang="ts" setup></script>

<template>
  <div class="content-container">
    <div class="error-image"></div>
  </div>
</template>

<style scoped>
.content-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.error-image {
  width: 100%;
  height: 100%;
}

@media (prefers-color-scheme: dark) {
  .error-image {
  }
}
</style>
