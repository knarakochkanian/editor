<script setup>
import { ref, watch } from 'vue'
import { useElementStore } from '../stores/elementStore'

const store = useElementStore()
const props = defineProps({
  selectedElement: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update'])

const selectedColor = ref('#000000')
const backgroundColor = ref('#FFFFFF')
const lineHeight = ref(1.5)
const letterSpacing = ref(0)

const predefinedPalettes = {
  basic: ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF'],
  warm: ['#FF9900', '#FF6600', '#FF3300', '#CC0000', '#990000'],
  cool: ['#00CCFF', '#0099FF', '#0066FF', '#0033FF', '#0000CC']
}

watch(
  () => props.selectedElement,
  (newVal) => {
    if (newVal?.style) {

      if (newVal.type === 'text') {
        selectedColor.value = newVal.style.color || '#000000'
        backgroundColor.value = newVal.style.backgroundColor || 'transparent'
        lineHeight.value = parseFloat(newVal.style.lineHeight) || 1.5
        letterSpacing.value = parseFloat(newVal.style.letterSpacing) || 0
      }

      else if (newVal.type === 'rectangle' || newVal.type === 'circle' || newVal.type === 'triangle' || newVal.type === 'star' || newVal.type === 'heart') {
        backgroundColor.value = newVal.style.backgroundColor || '#F37021'
      }
    }
  },
  { immediate: true }
)

const handleColorChange = (color) => {
  selectedColor.value = color
  if (props.selectedElement?.type === 'text') {
    store.updateTextStyle({ color })
    store.updateElement({
      ...props.selectedElement,
      style: {
        ...props.selectedElement.style,
        color
      }
    })
  }
}

const handleBackgroundColorChange = (color) => {
  backgroundColor.value = color
  if (props.selectedElement) {
    store.updateTextStyle({ 
      backgroundColor: color,
      background: color
    })
    store.updateElement({
      ...props.selectedElement,
      style: {
        ...props.selectedElement.style,
        backgroundColor: color,
        background: color
      }
    })
  }
}

const handleLineHeightChange = (value) => {
  lineHeight.value = value
  if (props.selectedElement?.type === 'text') {
    store.updateTextStyle({ lineHeight: value })
    store.updateElement({
      ...props.selectedElement,
      style: {
        ...props.selectedElement.style,
        lineHeight: value
      }
    })
  }
}

const handleLetterSpacingChange = (value) => {
  letterSpacing.value = value
  if (props.selectedElement?.type === 'text') {
    store.updateTextStyle({ letterSpacing: `${value}px` })
    store.updateElement({
      ...props.selectedElement,
      style: {
        ...props.selectedElement.style,
        letterSpacing: `${value}px`
      }
    })
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

input[type="color"] {
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.range-control {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.range-control input[type="range"] {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  background: #ddd;
  border-radius: 2px;
  outline: none;
}

.range-control input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #F37021;
  border-radius: 50%;
  cursor: pointer;
}

.range-value {
  min-width: 40px;
  text-align: right;
  font-size: 14px;
  color: #666;
}
</style> 