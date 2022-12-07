<script setup lang="ts">
import { RippleButton, ConfigureProvide } from '@liutsing/vue-components'
import HelloWorldVue from './components/HelloWorld.vue'

const handleClick = (e: MouseEvent) => {
  console.log(e, 'click')
}
</script>

<template>
  <ConfigureProvide :prefix-cls="'test'">
    <RippleButton @click="handleClick">Find More</RippleButton>
    <HelloWorldVue msg="11"></HelloWorldVue>
  </ConfigureProvide>
</template>

<style scoped></style>
