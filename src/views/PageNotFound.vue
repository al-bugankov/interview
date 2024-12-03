<script setup lang="ts">

</script>

<template>
<div class="content-container">
<div class="error-image">
</div>
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
  background: url("@/assets/backgroung/404-black-version.png") top/contain no-repeat;
}
@media (prefers-color-scheme: dark) {
  .error-image {
    background: url("@/assets/backgroung/404-light-version.png") top/contain no-repeat;
  }
}
</style>