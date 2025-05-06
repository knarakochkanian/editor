<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  selectedElement: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update'])

const selectedColor = ref('#000000')


watch(
  () => props.selectedElement,
  (newVal) => {
    if (newVal && newVal.style && newVal.style.color) {
      selectedColor.value = newVal.style.color
    }
  },
  { immediate: true }
)


const handleColorChange = (color) => {
  selectedColor.value = color
  if (props.selectedElement && props.selectedElement.type === 'text') {
    emit('update', {
      ...props.selectedElement,
      style: {
        ...props.selectedElement.style,
        color: color
      }
    })
  }
}
</script>

<template>
  <div class="text-color-picker" v-if="selectedElement?.type === 'text'">
    <h4>Text Color</h4>
    <div class="color-options">
      <button
        v-for="color in ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FF00FF', '#FFFF00', '#00FFFF', '#808080']"
        :key="color"
        class="color-btn"
        :style="{ backgroundColor: color }"
        :class="{ active: selectedColor === color }"
        @click="handleColorChange(color)"
      ></button>
    </div>
  </div>
</template>

<style scoped>
.text-color-picker {
  padding: 1rem;
  border-bottom: 1px solid #E0E0E0;
}

.text-color-picker h4 {
  margin-bottom: 1rem;
  color: #333;
  font-size: 14px;
}

.color-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.color-btn {
  width: 30px;
  height: 30px;
  border: 2px solid #fff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 0 1px #ccc;
}

.color-btn.active {
  box-shadow: 0 0 0 2px #F37021;
}
</style> 