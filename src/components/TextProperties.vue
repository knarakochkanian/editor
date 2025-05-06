<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  selectedElement: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update'])

const lineHeight = ref(1.5)
const letterSpacing = ref(0)
const backgroundColor = ref('transparent')


watch(
  () => props.selectedElement,
  (newVal) => {
    if (newVal?.style) {
      lineHeight.value = parseFloat(newVal.style.lineHeight) || 1.5
      letterSpacing.value = parseInt(newVal.style.letterSpacing) || 0
      backgroundColor.value = newVal.style.backgroundColor || 'transparent'
    }
  },
  { immediate: true }
)

const updateStyle = (property, value) => {
  if (!props.selectedElement) return

  emit('update', {
    ...props.selectedElement,
    style: {
      ...props.selectedElement.style,
      [property]: value
    }
  })
}

const handleLineHeightChange = (value) => {
  lineHeight.value = value
  updateStyle('lineHeight', value)
}

const handleLetterSpacingChange = (value) => {
  letterSpacing.value = value
  if (!props.selectedElement) return

  emit('update', {
    ...props.selectedElement,
    style: {
      ...props.selectedElement.style,
      letterSpacing: `${value}px`
    }
  })
}

const fontSize = ref(16)

watch(
    () => props.selectedElement,
    (newVal) => {
      if (newVal?.style) {
        fontSize.value = parseInt(newVal.style.fontSize) || 16
      }
    },
    { immediate: true }
)

const handleFontSizeChange = (value) => {
  fontSize.value = value
  updateStyle('fontSize', `${value}px`)
}

const handleBackgroundColorChange = (color) => {
  backgroundColor.value = color
  updateStyle('backgroundColor', color)
}
</script>

<template>
  <div class="text-properties" v-if="selectedElement?.type === 'text'">
    <div class="property-group">
      <div class="property-group">
        <label>Размер шрифта</label>
        <div class="slider-group">
          <input
              type="range"
              :value="fontSize"
              min="8"
              max="72"
              step="1"
              @input="e => handleFontSizeChange(parseInt(e.target.value))"
          >
          <span class="value">{{ fontSize }}px</span>
        </div>
      </div>

      <label>Межстрочный интервал</label>
      <div class="slider-group">
        <input
          type="range"
          :value="lineHeight"
          min="1"
          max="3"
          step="0.1"
          @input="e => handleLineHeightChange(parseFloat(e.target.value))"
        >
        <span class="value">{{ lineHeight.toFixed(1) }}</span>
      </div>
    </div>

    <div class="property-group">
      <label>Интервал между символами</label>
      <div class="slider-group">
        <input 
          type="range" 
          :value="letterSpacing"
          min="-2"
          max="10"
          step="0.1"
          @input="e => handleLetterSpacingChange(parseFloat(e.target.value))"
        >
        <span class="value">{{ letterSpacing }}px</span>
      </div>
    </div>

    <div class="property-group">
      <label>Цвет фона текста</label>
      <div class="color-group">
        <input 
          type="color" 
          v-model="backgroundColor"
          @change="handleBackgroundColorChange(backgroundColor)"
        >
        <input 
          type="text" 
          v-model="backgroundColor"
          class="color-code"
          @change="handleBackgroundColorChange(backgroundColor)"
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-properties {
  padding: 1rem;
  border-bottom: 1px solid #E0E0E0;
}

.property-group {
  margin-bottom: 1rem;
}

.property-group:last-child {
  margin-bottom: 0;
}

.property-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

.slider-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.slider-group input[type="range"] {
  flex: 1;
  -webkit-appearance: none;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  outline: none;
}

.slider-group input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #F37021;
  border-radius: 50%;
  cursor: pointer;
}

.slider-group input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #F37021;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.value {
  min-width: 45px;
  text-align: right;
  color: #666;
}

.color-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

input[type="color"] {
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.color-code {
  flex: 1;
  padding: 0.25rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style> 