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
    <div>
      <MapleButton size="small">small</MapleButton>
      <MapleButton
        size="small"
        type="primary"
      >
        small
      </MapleButton>
      <MapleButton
        size="small"
        type="error"
      >
        small
      </MapleButton>
    </div>
    <div>
      <MapleButton>middle</MapleButton>
      <MapleButton type="primary">middle</MapleButton>
      <MapleButton type="error">middle</MapleButton>
    </div>
    <div>
      <MapleButton size="large">large</MapleButton>
      <MapleButton
        size="large"
        type="primary"
      >
        large
      </MapleButton>
      <MapleButton
        size="large"
        type="error"
      >
        large
      </MapleButton>
    </div>
    <div>
      <MapleButton
        :size="size"
        :type="type"
        @click="handleChange"
      >
        React Button
      </MapleButton>
    </div>
  </main>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

// DEV
// import type { ButtonSize, ButtonType } from 'src/MapleButton.vue'
// import { InputDemo, MapleButton } from '../src'

// PROD
import type { ButtonSize, ButtonType } from '../dist/types/MapleButton.vue'
import { InputDemo, MapleButton } from '../'
import '../dist/style.css'

const size = ref<ButtonSize>('small')
const type = ref<ButtonType>('default')

const handleChange = () => {
  const index = Math.floor(Math.random() * 3)
  size.value = ['large', 'middle', 'small'][index] as ButtonSize
  type.value = ['default', 'primary', 'error'][index] as ButtonType
}
</script>

<style lang="sass" scoped></style>
