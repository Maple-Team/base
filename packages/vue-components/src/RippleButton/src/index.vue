<template>
  <button
    class="btn"
    :class="`${prefixCls}-btn`"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>
<script setup lang="ts">
import { inject } from 'vue'
const prefixCls = inject('prefixCls')
const emit = defineEmits<{
  (e: 'click', args: MouseEvent): void
}>()

const handleClick = (e: MouseEvent) => {
  emit('click', e)
  const button = e.target as HTMLButtonElement
  const ripple = button.querySelector('.ripple')
  if (ripple) {
    ripple.remove()
  }
  const diameter = Math.max(button.clientWidth, button.clientHeight)
  const radius = diameter / 2

  const span = document.createElement('span')
  span.style.width = `${diameter}px`
  span.style.height = `${diameter}px`
  span.style.left = `${e.clientX - (button.offsetLeft + radius)}px`
  span.style.top = `${e.clientY - (button.offsetTop + radius)}px`

  span?.classList.add('ripple')
  button.appendChild(span)
}
// FIXME 动态元素 样式作用域问题
</script>

<style lang="scss">
span.ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 600ms linear;
  background-color: rgba($color: #ffffff, $alpha: 0.7);
}
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
.btn {
  position: relative;
  overflow: hidden;
  transition: background 400ms;
  color: #fff;
  background-color: #6200ee;
  padding: 1rem 2rem;
  font-family: 'Roboto', sans-serif;
  font-size: 1.5rem;
  outline: 0;
  border: 0;
  border-radius: 0.25rem;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3);
  cursor: pointer;
}
</style>
