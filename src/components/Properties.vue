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
  opacity: 100,
  shadow: {
    enabled: false,
    color: '#000000',
    blur: 10,
    offsetX: 0,
    offsetY: 0
  },
  glow: {
    enabled: false,
    color: '#ffffff',
    blur: 10
  },
  stroke: {
    enabled: false,
    color: '#000000',
    width: 2
  }
})

const updateProperty = (key, value) => {
  if (props.selectedElement) {
    emit('update', { ...props.selectedElement, [key]: value })
  }
}

const updateEffect = (effect, key, value) => {
  if (props.selectedElement) {
    const updatedEffect = { ...properties.value[effect], [key]: value }
    emit('update', { ...props.selectedElement, [effect]: updatedEffect })
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
        <label>Rotation</label>
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
        <label>Opacity</label>
        <input 
          type="range" 
          v-model="properties.opacity"
          min="0"
          max="100"
          @input="updateProperty('opacity', properties.opacity)"
        >
        <span>{{ properties.opacity }}%</span>
      </div>

      <div class="property-group">
        <label>Shadow</label>
        <div class="effect-controls">
          <label class="checkbox">
            <input 
              type="checkbox" 
              v-model="properties.shadow.enabled"
              @change="updateEffect('shadow', 'enabled', properties.shadow.enabled)"
            >
            Enable
          </label>
          <div v-if="properties.shadow.enabled" class="effect-properties">
            <div class="input-group">
              <span>Color</span>
              <input 
                type="color" 
                v-model="properties.shadow.color"
                @change="updateEffect('shadow', 'color', properties.shadow.color)"
              >
            </div>
            <div class="input-group">
              <span>Blur</span>
              <input 
                type="range" 
                v-model="properties.shadow.blur"
                min="0"
                max="50"
                @input="updateEffect('shadow', 'blur', properties.shadow.blur)"
              >
            </div>
            <div class="input-group">
              <span>Offset X</span>
              <input 
                type="range" 
                v-model="properties.shadow.offsetX"
                min="-50"
                max="50"
                @input="updateEffect('shadow', 'offsetX', properties.shadow.offsetX)"
              >
            </div>
            <div class="input-group">
              <span>Offset Y</span>
              <input 
                type="range" 
                v-model="properties.shadow.offsetY"
                min="-50"
                max="50"
                @input="updateEffect('shadow', 'offsetY', properties.shadow.offsetY)"
              >
            </div>
          </div>
        </div>
      </div>

      <div class="property-group">
        <label>Glow</label>
        <div class="effect-controls">
          <label class="checkbox">
            <input 
              type="checkbox" 
              v-model="properties.glow.enabled"
              @change="updateEffect('glow', 'enabled', properties.glow.enabled)"
            >
            Enable
          </label>
          <div v-if="properties.glow.enabled" class="effect-properties">
            <div class="input-group">
              <span>Color</span>
              <input 
                type="color" 
                v-model="properties.glow.color"
                @change="updateEffect('glow', 'color', properties.glow.color)"
              >
            </div>
            <div class="input-group">
              <span>Blur</span>
              <input 
                type="range" 
                v-model="properties.glow.blur"
                min="0"
                max="50"
                @input="updateEffect('glow', 'blur', properties.glow.blur)"
              >
            </div>
          </div>
        </div>
      </div>

      <div class="property-group">
        <label>Stroke</label>
        <div class="effect-controls">
          <label class="checkbox">
            <input 
              type="checkbox" 
              v-model="properties.stroke.enabled"
              @change="updateEffect('stroke', 'enabled', properties.stroke.enabled)"
            >
            Enable
          </label>
          <div v-if="properties.stroke.enabled" class="effect-properties">
            <div class="input-group">
              <span>Color</span>
              <input 
                type="color" 
                v-model="properties.stroke.color"
                @change="updateEffect('stroke', 'color', properties.stroke.color)"
              >
            </div>
            <div class="input-group">
              <span>Width</span>
              <input 
                type="range" 
                v-model="properties.stroke.width"
                min="1"
                max="20"
                @input="updateEffect('stroke', 'width', properties.stroke.width)"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="no-selection">
      Select an element to edit its properties
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
}

input[type="color"] {
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.effect-controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.effect-properties {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-left: 1rem;
}

.no-selection {
  color: #666;
  text-align: center;
  padding: 2rem;
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style> 