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
const backgroundColor = ref('#FFFFFF')
const gradientType = ref('linear')
const gradientColors = ref(['#ffffff', '#000000'])

const gradientTypes = [
  { value: 'linear', label: 'Linear' },
  { value: 'radial', label: 'Radial' }
]

const predefinedPalettes = {
  basic: ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF'],
  warm: ['#FF9900', '#FF6600', '#FF3300', '#CC0000', '#990000'],
  cool: ['#00CCFF', '#0099FF', '#0066FF', '#0033FF', '#0000CC']
}

watch(
  () => props.selectedElement,
  (newVal) => {
    if (newVal?.style) {
      // For text elements, track text color
      if (newVal.type === 'text' && newVal.style.color) {
        selectedColor.value = newVal.style.color
      }
      // For all elements, track background color
      if (newVal.type === 'text') {
        backgroundColor.value = newVal.style.backgroundColor || 'transparent'
      } else if (newVal.type === 'rectangle' || newVal.type === 'circle' || newVal.type === 'triangle' || newVal.type === 'star' || newVal.type === 'heart') {
        backgroundColor.value = newVal.style.backgroundColor || '#F37021'
      }
    }
  },
  { immediate: true }
)

const handleColorChange = (color) => {
  selectedColor.value = color
  if (props.selectedElement?.type === 'text') {
    emit('update', {
      ...props.selectedElement,
      style: {
        ...props.selectedElement.style,
        color: color
      }
    })
  }
}

const handleBackgroundColorChange = (color) => {
  backgroundColor.value = color
  if (props.selectedElement) {
    emit('update', {
      ...props.selectedElement,
      style: {
        ...props.selectedElement.style,
        backgroundColor: color
      }
    })
  }
}

const addGradientColor = () => {
  gradientColors.value.push('#000000')
}

const removeGradientColor = (index) => {
  gradientColors.value.splice(index, 1)
}

const updateGradient = () => {
  const colors = gradientColors.value.join(', ')
  if (gradientType.value === 'linear') {
    return `linear-gradient(90deg, ${colors})`
  } else {
    return `radial-gradient(circle, ${colors})`
  }
}
</script>

<template>
  <div class="color-palette" v-if="selectedElement">
    <div class="section" v-if="selectedElement.type === 'text'">
      <h4>Цвет текста</h4>
      <div class="color-picker">
        <input type="color" v-model="selectedColor" @change="handleColorChange(selectedColor)">
        <input 
          type="text" 
          v-model="selectedColor" 
          class="color-code"
          @change="handleColorChange(selectedColor)"
        >
      </div>
    </div>

    <div class="section">
      <h4>Цвет фона</h4>
      <div class="color-picker">
        <input type="color" v-model="backgroundColor" @change="handleBackgroundColorChange(backgroundColor)">
        <input 
          type="text" 
          v-model="backgroundColor" 
          class="color-code"
          @change="handleBackgroundColorChange(backgroundColor)"
        >
      </div>
    </div>

    <div class="section">
      <h4>Градиент</h4>
      <div class="gradient-controls">
        <select v-model="gradientType">
          <option v-for="type in gradientTypes" :key="type.value" :value="type.value">
            {{ type.label }}
          </option>
        </select>
        
        <div class="gradient-colors">
          <div v-for="(color, index) in gradientColors" :key="index" class="gradient-color">
            <input type="color" v-model="gradientColors[index]">
            <button @click="removeGradientColor(index)" :disabled="gradientColors.length <= 2">×</button>
          </div>
          <button @click="addGradientColor">+</button>
        </div>

        <div class="gradient-preview" :style="{ background: updateGradient() }"></div>
      </div>
    </div>

    <div class="section">
      <h4>Готовые цвета</h4>
      <div class="palettes">
        <div v-for="(colors, name) in predefinedPalettes" :key="name" class="palette">
          <h5>{{ name }}</h5>
          <div class="palette-colors">
            <div
              v-for="color in colors"
              :key="color"
              class="palette-color"
              :style="{ backgroundColor: color }"
              @click="handleBackgroundColorChange(color)"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color-palette {
  padding: 1rem;
}

.section {
  margin-bottom: 1.5rem;
}

.section h4 {
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

.color-picker {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.color-code {
  flex: 1;
  padding: 0.25rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.gradient-controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.gradient-colors {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.gradient-color {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.gradient-preview {
  height: 40px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.palettes {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.palette h5 {
  margin-bottom: 0.5rem;
  text-transform: capitalize;
}

.palette-colors {
  display: flex;
  gap: 0.25rem;
}

.palette-color {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #ddd;
}

button {
  padding: 0.25rem 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

input[type="color"] {
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}
</style> 