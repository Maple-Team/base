<template>
  <button
    class="btn"
    :class="`btn-${size} btn-${type}`"
  >
    <slot></slot>
  </button>
</template>
<script lang="ts" setup>
export type ButtonSize = 'large' | 'middle' | 'small'
export type ButtonType = 'default' | 'primary' | 'error'
withDefaults(
  defineProps<{
    label?: string
    size: ButtonSize
    type: ButtonType
  }>(),
  {
    size: 'middle',
    type: 'default',
  }
)
</script>

<style lang="scss" scoped>
.btn {
  padding: 2px;
  color: white;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 4px;
  margin-bottom: 10px;
  font-size: 16px;
}
// 举例
.btn-middle {
  padding: 12px;
}
.btn-small {
  padding: 8px;
}
.btn-large {
  padding: 16px;
}
.btn-default {
  background: white;
  color: #000;
  border-color: #000;
}
.btn-primary {
  background: blue;
  border-color: blue;
}
.btn-error {
  background: red;
  border-color: red;
}
</style>
