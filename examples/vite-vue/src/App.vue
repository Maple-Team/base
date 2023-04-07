<script setup lang="ts">
import { ConfigureProvide, RippleButton } from '@liutsing/vue-components'
import HelloWorldVue from './components/HelloWorld.vue'

const handleClick = (e: MouseEvent) => {
  console.log(e, 'click')
}
</script>

<template>
  <ConfigureProvide prefix-cls="test">
    <RippleButton @click="handleClick">Find More</RippleButton>
    <HelloWorldVue msg="11" />
  </ConfigureProvide>
</template>

<style scoped></style>
