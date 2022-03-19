<template>
  <div class="home">
    <img alt="Vue logo" src="./images/logo.png" />
    <HelloWorld msg="Welcome to Your Vue3 Boilerplate" />
    <DemoComp modelValue="test" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DemoComp from '@/components/demo-comp/demo-comp'
import HelloWorld from './components/hello-world.vue'

export default defineComponent({
  name: 'HomePage',
  components: { HelloWorld, DemoComp },
})
</script>
