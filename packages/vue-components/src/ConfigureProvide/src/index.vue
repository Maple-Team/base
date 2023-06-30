<template>
  <slot> </slot>
</template>
<script lang="ts" setup>
import { provide } from 'vue'
export interface ContextProps {
  prefixCls?: string
  locale?: string
}

const props = withDefaults(defineProps<ContextProps>(), {
  prefixCls: () => 'maple',
})

provide('prefixCls', props.prefixCls)
</script>
