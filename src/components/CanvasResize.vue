<template>
  <div class="canvas-resize">
    <div class="aside__block">
      <div class="aside__subheader">
        <div class="aside__label">Изменить размер</div>
      </div>
      <form @submit.prevent="handleResize" class="resize-form">
        <div class="section">
          <div class="input-group">
            <div class="input-group__item">
              <span class="input-group__test">Ширина</span>
              <input
                id="width"
                type="number"
                v-model="width"
                :disabled="!isUnlocked"
                @input="handleWidthChange"
                class="resize-input width-input"
              />
            </div>

            <div class="input-group__item">
              <span class="input-group__test" style="color: white;">Высота</span>
              <input
                id="height"
                type="number"
                v-model="height"
                :disabled="!isUnlocked"
                @input="handleHeightChange"
                class="resize-input height-input"
              />
      
            </div>
            <button type="button" class="lock-float" @click="toggleLock">
                <img :src="isUnlocked ? '/icons/unlock.svg' : '/icons/lock.svg'" alt="lock" />
              </button>
          </div>
        </div>

        <div class="section">
          <div class="proportional-option">
            <input 
              type="checkbox" 
              id="proportional" 
              v-model="isProportional"
            >
            <label for="proportional">Пропорциональное перемещение объектов</label>
          </div>
        </div>

        <div class="section">
          <button type="submit" class="resize-button">
            Изменить размер
          </button>
        </div>
      </form>

      <div class="aside__subheader">
        <div class="aside__label">Готовые форматы</div>
      </div>
      <div class="preset-list">
        <button 
          v-for="preset in presets" 
          :key="preset.name"
          class="preset-item"
          type="button"
          @click="applyPreset(preset)"
        >
          <div class="flex gap-xs items-center">
            <div class="preset-icon" :style="{ width: preset.withIcon + 'px' }">
            </div>
            <div>
              <div>{{ preset.name }}</div>
              <div class="preset-description">{{ preset.dimensions }}</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  initialWidth: {
    type: Number,
    required: true
  },
  initialHeight: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['resize', 'rotate', 'scale'])

const width = ref(props.initialWidth)
const height = ref(props.initialHeight)
const isUnlocked = ref(false)
const isProportional = ref(true)
const scale = ref(100)
const aspectRatio = computed(() => props.initialWidth / props.initialHeight)

const presets = [
  { 
    name: 'Квадрат 1:1',
    dimensions: '1080 x 1080 px',
    width: 1080,
    height: 1080,
    withIcon: 24
  },
  { 
    name: '1.91:1',
    dimensions: '1080 x 565 px',
    width: 1080,
    height: 565,
    withIcon: 15
  },
  { 
    name: '4:3',
    dimensions: '1080 x 810 px',
    width: 1080,
    height: 810,
    withIcon: 18
  },
  { 
    name: '4:5',
    dimensions: '1080 x 1350 px',
    width: 1080,
    height: 1350,
    withIcon: 20
  }
]

const toggleLock = () => {
  isUnlocked.value = !isUnlocked.value
}

const handleWidthChange = () => {
  if (isProportional.value && isUnlocked.value) {
    height.value = Math.round(width.value / aspectRatio.value)
  }
}

const handleHeightChange = () => {
  if (isProportional.value && isUnlocked.value) {
    width.value = Math.round(height.value * aspectRatio.value)
  }
}

const handleResize = () => {
  emit('resize', {
    width: parseInt(width.value),
    height: parseInt(height.value),
    isProportional: isProportional.value
  })
}

const applyPreset = (preset) => {
  const newWidth = parseInt(preset.width)
  const newHeight = parseInt(preset.height)
  
  width.value = newWidth
  height.value = newHeight
  
  emit('resize', {
    width: newWidth,
    height: newHeight,
    isProportional: isProportional.value
  })
}

const rotateLeft = () => {
  emit('rotate', -90)
}

const rotateRight = () => {
  emit('rotate', 90)
}

const handleScaleChange = () => {
  emit('scale', scale.value)
}

const fitToScreen = () => {
  scale.value = 100
  emit('scale', 100)
}
</script>

<style scoped>
.canvas-resize {
  padding: 1rem;
}

.aside__block {
  margin-bottom: 1.5rem;
}

.aside__subheader {
  margin-bottom: 1rem;
}

.aside__label {
  font-weight: 600;
  color: #333;
}

.section {
  margin-bottom: 1rem;
}

.flex {
  display: flex;
}

.gap-xxxs {
  gap: 0.5rem;
}

.items-center {
  align-items: center;
}

.form-field {
  flex: 1;
}

.form-field label {
  display: block;
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.form-field input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
}

.form-field input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.lock-button {
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
}

.lock-button img {
  width: 20px;
  height: 20px;
}

.proportional-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

.resize-button {
  width: 100%;
  max-width: 156px;
  padding: 0.75rem;
  background-color: #F37021;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
}

.resize-button:hover {
  background-color: #e65c00;
}

.preset-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preset-item {
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  outline: unset;
  background: unset;
  border: unset;
}

.preset-item:hover {
  background-color: #f5f5f5;
}

.preset-icon {
  height: 24px;
  background-color: #EAEAEA;
}

.preset-description {
  font-size: 0.75rem;
  color: #666;
}

.gap-xs {
  gap: 0.75rem;
}
.button__ico {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button__ico svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}
.input-group {
  position: relative;
  display: flex;
  gap: 8px;
  align-items: center;
}

.resize-input {
  width: 120px;
  padding: 20px 0 0 0 ;
  font-size: 32px;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  text-align: center;
  color: #fff;
}

.width-input {
  background-color: #f2f2f2;
  color: #F37021;
}

.height-input {
  background-color: #F37021;
}

.lock-float {
  background: #fff;
  border-radius: 9999px;
  border: 2px solid #ddd;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.lock-float img {
  width: 20px;
  height: 20px;
}
.input-group__item{
  position: relative;
}
.input-group__test{
  position: absolute;
  top: 7px;
  left: 11px;
  font-family: Proxima Nova;
font-weight: 400;
font-size: 16px;
line-height: 100%;
letter-spacing: 0%;
color: #F37021CC;

  
}
</style> 