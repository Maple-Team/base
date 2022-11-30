<script setup lang="ts">
import { RippleButton } from '@liutsing/vue-components'
const handleClick = (e: MouseEvent) => {
  console.log(e, 'click')
}
</script>

<template>
  <RippleButton @click="handleClick">Find More</RippleButton>
</template>

<style scoped></style>
