<template>
  <main>
    <h1>Welcome to your sandbox environment</h1>
    <InputDemo
      label="test"
      :input-attributes="{
        placeholder: 'Enter your firstname...',
        type: 'text',
        autocomplete: 'given-name',
      }"
    >
      First-name
    </InputDemo>
  </main>
</template>
<script lang="ts" setup>
import { InputDemo } from '../src'
</script>

<style lang="sass" scoped></style>
