<script setup>
import { ref } from 'vue'

const selectedColor = ref('#000000')
const gradientType = ref('linear')
const gradientAngle = ref(0)
const gradientColors = ref(['#ff0000', '#00ff00'])

const predefinedPalettes = {
  pastel: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA', '#FFE4BA'],
  contrast: ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF'],
  summer: ['#FFD700', '#FF69B4', '#98FB98', '#87CEEB', '#FFA07A'],
  winter: ['#F0F8FF', '#E6E6FA', '#B0E0E6', '#DDA0DD', '#B0C4DE']
}

const gradientTypes = [
  { value: 'linear', label: 'Linear' },
  { value: 'radial', label: 'Radial' },
  { value: 'angular', label: 'Angular' },
  { value: 'mirrored', label: 'Mirrored' }
]

const updateGradient = () => {
  const gradient = `${gradientType.value}-gradient(${gradientAngle.value}deg, ${gradientColors.value.join(', ')})`
  return gradient
}

const addGradientColor = () => {
  gradientColors.value.push('#000000')
}

const removeGradientColor = (index) => {
  if (gradientColors.value.length > 2) {
    gradientColors.value.splice(index, 1)
  }
}
</script>

<template>
  <div class="color-palette">
    <div class="section">
      <h4>Solid Color</h4>
      <div class="color-picker">
        <input type="color" v-model="selectedColor">
        <input type="text" v-model="selectedColor" class="color-code">
      </div>
    </div>

    <div class="section">
      <h4>Gradient</h4>
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
      <h4>Predefined Palettes</h4>
      <div class="palettes">
        <div v-for="(colors, name) in predefinedPalettes" :key="name" class="palette">
          <h5>{{ name }}</h5>
          <div class="palette-colors">
            <div
              v-for="color in colors"
              :key="color"
              class="palette-color"
              :style="{ backgroundColor: color }"
              @click="selectedColor = color"
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
</style> 