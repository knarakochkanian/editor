<script setup>
import { ref } from 'vue'

const props = defineProps({
  selectedElement: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update'])

const properties = ref({
  width: 100,
  height: 100,
  rotation: 0,
  opacity: 100
})

const updateProperty = (key, value) => {
  if (props.selectedElement) {
    emit('update', { ...props.selectedElement, [key]: value })
  }
}
</script>

<template>
  <div class="properties-panel">
    <h4>Properties</h4>
    
    <div v-if="selectedElement" class="properties-section">
      <div class="property-group">
        <label>Size</label>
        <div class="size-inputs">
          <div class="input-group">
            <span>W</span>
            <input 
              type="number" 
              v-model="properties.width"
              @change="updateProperty('width', properties.width)"
            >
          </div>
          <div class="input-group">
            <span>H</span>
            <input 
              type="number" 
              v-model="properties.height"
              @change="updateProperty('height', properties.height)"
            >
          </div>
        </div>
      </div>

      <div class="property-group">
        <label>Повернуть</label>
        <input 
          type="range" 
          v-model="properties.rotation"
          min="0"
          max="360"
          @input="updateProperty('rotation', properties.rotation)"
        >
        <span>{{ properties.rotation }}°</span>
      </div>

      <div class="property-group">
        <label>Прозрачность</label>
        <input 
          type="range" 
          v-model="properties.opacity"
          min="0"
          max="100"
          @input="updateProperty('opacity', properties.opacity)"
        >
        <span>{{ properties.opacity }}%</span>
      </div>
    </div>
    
    <div v-else class="no-selection">
      Выберите элемент, чтобы отредактировать его свойства
    </div>
  </div>
</template>

<style scoped>
.properties-panel {
  padding: 1rem;
}

.properties-panel h4 {
  margin-bottom: 1rem;
  color: #333;
}

.properties-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.property-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.property-group label {
  font-weight: 500;
  color: #666;
}

.size-inputs {
  display: flex;
  gap: 1rem;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.input-group span {
  min-width: 40px;
}

input[type="number"] {
  width: 60px;
  padding: 0.25rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

input[type="range"] {
  width: 100%;
  -webkit-appearance: none;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #F37021;
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #F37021;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.no-selection {
  color: #666;
  text-align: center;
  padding: 2rem;
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style> 