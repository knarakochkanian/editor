<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Elements from './components/Elements.vue'
import ColorPalette from './components/ColorPalette.vue'
import Alignment from './components/Alignment.vue'
import Properties from './components/Properties.vue'
import TextColorPicker from './components/TextColorPicker.vue'
import TextProperties from './components/TextProperties.vue'
import Header from "@/components/Header.vue";
import ElementControls from './components/ElementControls.vue'
import { useElementStore } from './stores/elementStore'

const store = useElementStore()
const backgroundImage = ref(null)

const handleSetBackground = (url) => {
  backgroundImage.value = url
}

const canvasSize = ref({
  width: 620,
  height: 520
})

const orientation = ref('landscape')

const handleAddElement = (element) => {
  store.addElement(element)
}

const handleElementSelect = (element) => {
  store.setSelectedElement(element)
}

const handleTextEdit = (event, element) => {
  if (event.target.value === null || event.target.value === undefined) {
    element.content = ''
  } else {
    element.content = event.target.value
    // Auto-adjust height based on content
    const textarea = event.target
    const lines = element.content.split('\n').length
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 20
    const newHeight = Math.max(100, lines * lineHeight + 24) // 24px for padding
    element.height = newHeight
    store.updateElement(element)
  }
}

const handleTextClick = (event, element) => {
  event.stopPropagation()
  store.setSelectedElement(element)
}

const handleElementUpdate = (updatedElement) => {
  store.updateElement(updatedElement)
}

const handleAlignment = (alignment) => {
  if (!store.selectedElement) return
  
  const element = store.selectedElement
  const contentArea = document.querySelector('.content-area')
  const contentRect = contentArea.getBoundingClientRect()
  
  // Calculate available space (content area dimensions minus padding)
  const padding = 24 // padding from CSS
  const availableWidth = contentArea.clientWidth - (padding * 2)
  const availableHeight = contentArea.clientHeight - (padding * 2)
  
  switch (alignment) {
    case 'top-left':
      element.x = padding
      element.y = padding
      break
    case 'top-center':
      element.x = padding + (availableWidth - element.width) / 2
      element.y = padding
      break
    case 'top-right':
      element.x = padding + availableWidth - element.width
      element.y = padding
      break
    case 'middle-left':
      element.x = padding
      element.y = padding + (availableHeight - element.height) / 2
      break
    case 'middle-center':
      element.x = padding + (availableWidth - element.width) / 2
      element.y = padding + (availableHeight - element.height) / 2
      break
    case 'middle-right':
      element.x = padding + availableWidth - element.width
      element.y = padding + (availableHeight - element.height) / 2
      break
    case 'bottom-left':
      element.x = padding
      element.y = padding + availableHeight - element.height
      break
    case 'bottom-center':
      element.x = padding + (availableWidth - element.width) / 2
      element.y = padding + availableHeight - element.height
      break
    case 'bottom-right':
      element.x = padding + availableWidth - element.width
      element.y = padding + availableHeight - element.height
      break
  }

  // Update the element in the elements array
  const index = store.elements.findIndex(el => el.id === element.id)
  if (index !== -1) {
    store.elements[index] = { ...element }
  }
}

const handleSchedulePost = () => {
  console.log('Scheduling post')
}

const handleDownload = () => {
  const layoutData = {
    size: canvasSize.value,
    orientation: orientation.value,
    elements: store.elements
  }
  
  const jsonString = JSON.stringify(layoutData, null, 2)
  
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'layout.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const startDrag = (event, element) => {
  const startX = event.clientX - element.x
  const startY = event.clientY - element.y
  
  const drag = (e) => {
    element.x = e.clientX - startX
    element.y = e.clientY - startY
  }
  
  const stopDrag = () => {
    document.removeEventListener('mousemove', drag)
    document.removeEventListener('mouseup', stopDrag)
  }
  
  document.addEventListener('mousemove', drag)
  document.addEventListener('mouseup', stopDrag)
}

import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const downloadAsPDF = async () => {
  const content = document.querySelector('.content-area')

  if (!content) return

  const canvas = await html2canvas(content, {
    scale: 2,
    useCORS: true
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height]
  })

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
  pdf.save('layout.pdf')
}

const handleCopyElement = () => {
  if (!store.selectedElement) return

  const newElement = {
    ...store.selectedElement,
    id: Date.now(),
    x: store.selectedElement.x + 20,
    y: store.selectedElement.y + 20
  }
  store.addElement(newElement)
  store.setSelectedElement(newElement)
}

const handleDeleteElement = () => {
  if (!store.selectedElement) return

  const index = store.elements.findIndex(el => el.id === store.selectedElement.id)
  if (index !== -1) {
    store.elements.splice(index, 1)
    store.setSelectedElement(null)
  }
}

const handleMoveElement = (direction) => {
  if (!store.selectedElement) return

  const index = store.elements.findIndex(el => el.id === store.selectedElement.id)
  if (index === -1) return

  if (direction === 'up' && index < store.elements.length - 1) {
    // Move element up in z-index (swap with the next element)
    [store.elements[index], store.elements[index + 1]] = [store.elements[index + 1], store.elements[index]]
  } else if (direction === 'down' && index > 0) {
    // Move element down in z-index (swap with the previous element)
    [store.elements[index], store.elements[index - 1]] = [store.elements[index - 1], store.elements[index]]
  }
}

const handleKeyDown = (event) => {
  if (!store.selectedElement) return

  if (store.selectedElement.type === 'text' && event.target.tagName.toLowerCase() === 'input') {
    return
  }

  const step = event.shiftKey ? 10 : 1

  switch (event.key) {
    case 'ArrowLeft':
      store.selectedElement.x -= step
      event.preventDefault()
      break
    case 'ArrowRight':
      store.selectedElement.x += step
      event.preventDefault()
      break
    case 'ArrowUp':
      store.selectedElement.y -= step
      event.preventDefault()
      break
    case 'ArrowDown':
      store.selectedElement.y += step
      event.preventDefault()
      break
  }

  const index = store.elements.findIndex(el => el.id === store.selectedElement.id)
  if (index !== -1) {
    store.elements[index] = { ...store.selectedElement }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

</script>

<template>
  <Header @download-pdf="downloadAsPDF" />
  <div class="editor-container">
    <div class="left-panel">
      <Elements @add-element="handleAddElement" @set-background="handleSetBackground" />
    </div>

    <div class="main-content">
      <div
          class="content-area"
          :style="{
            width: canvasSize.width + 'px',
            height: canvasSize.height + 'px',
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }"
      >
        <div v-if="store.elements.length === 0" class="placeholder-content">
          <h2>Область содержимого</h2>
          <p>Добавьте элементы с левой панели, чтобы начать создавать свой дизайн</p>
        </div>
        <div
          v-for="element in store.elements"
          :key="element.id"
          class="content-element"
          :class="['content-element', element.class, { selected: store.selectedElement?.id === element.id }]"
          :style="{
            position: 'absolute',
            left: element.x + 'px',
            top: element.y + 'px',
            width: element.width + 'px',
            height: element.height + 'px',
            transform: `rotate(${element.rotation}deg)`,
            opacity: element.opacity / 100,
            ...(typeof element.style === 'object' ? element.style : {})
          }"
          @mousedown="startDrag($event, element)"
          @click="handleElementSelect(element)"
        >

          <div v-if="element.type === 'text'" class="text-element" @click="handleTextClick($event, element)">
            <input
              v-if="store.selectedElement?.id === element.id"
              type="text"
              v-model="element.content"
              ref="textInput"
              class="text-input"
              @blur="element.isNew = false"
              @input="handleTextEdit($event, element)"
              @click.stop
            />
            <span v-else>{{ element.content }}</span>
          </div>
          

          <div v-else-if="element.type === 'rectangle'" class="shape-element rectangle"></div>
          <div v-else-if="element.type === 'circle'" class="shape-element circle"></div>
          <div v-else-if="element.type === 'triangle'" class="shape-element triangle"></div>
          <div v-else-if="element.type === 'star'" class="shape-element star"></div>
          <div v-else-if="element.type === 'heart'" class="shape-element heart"></div>
          

          <img v-else-if="element.type === 'image'" :src="element.url" :alt="element.name" class="image-element">
        </div>
      </div>
      
      <ElementControls
        v-if="store.selectedElement"
        @copy="handleCopyElement"
        @delete="() => store.deleteElement(store.selectedElement.id)"
        @move-up="() => handleMoveElement('up')"
        @move-down="() => handleMoveElement('down')"
      />
    </div>

    <div class="right-panel">
      <Alignment @align="handleAlignment" />
      <TextColorPicker 
        :selected-element="store.selectedElement"
        @update="store.updateElement"
      />
      <TextProperties
        :selected-element="store.selectedElement"
        @update="store.updateElement"
      />
      <ColorPalette 
        :selected-element="store.selectedElement"
        @update="store.updateElement"
      />
      <Properties 
        :selected-element="store.selectedElement"
        @update="store.updateElement"
      />
    </div>
  </div>
</template>

<style scoped>
.editor-container {
  display: grid;
  grid-template-columns: 450px 1fr 300px;
  height: 90vh;
  background-color: #F5F5F5;
}

.left-panel, .right-panel {
  background-color: white;
  border-right: 1px solid #E0E0E0;
  overflow-y: auto;
  padding: 20px;
}

.right-panel {
  border-right: none;
  border-left: 1px solid #E0E0E0;
}

.main-content {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #F5F5F5;
}

.input-group label {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.content-area {
  flex: 1;
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.placeholder-content {
  text-align: center;
  color: #666;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.placeholder-content h2 {
  margin-bottom: 8px;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

.placeholder-content p {
  font-size: 14px;
  color: #666;
}

.content-element {
  position: absolute;
  cursor: move;
  user-select: none;
}

.content-element.selected {
  outline: 2px solid #2196F3;
}

.text-element {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: 1px dashed #E0E0E0;
  border-radius: 8px;
  background-color: transparent;
  font-size: inherit;
  color: inherit;
  cursor: text;
  position: relative;
}

.text-input {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  font-size: inherit;
  font-family: inherit;
  color: inherit;
  text-align: center;
  outline: none;
  padding: 0;
  margin: 0;
  cursor: text;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.text-input:focus {
  background: rgba(33, 150, 243, 0.05);
}

.shape-element {
  width: 100%;
  height: 100%;
  background-color: inherit;
  border-radius: 10px;
}

.shape-element.circle {
  border-radius: 50%;
}

.shape-element.triangle {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.shape-element.star {
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}

.shape-element.heart {
  clip-path: path('M12,21.35l-1.45-1.32C5.4,15.36 2,12.28 2,8.5 2,5.42 4.42,3 7.5,3c1.74,0 3.41,0.81 4.5,2.09C13.09,3.81 14.76,3 16.5,3 19.58,3 22,5.42 22,8.5c0,3.78 -3.4,6.86 -8.55,11.54L12,21.35z');
}

.image-element {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

input[type="number"] {
  width: 90px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
}

input[type="number"]:focus {
  outline: none;
  border-color: #2196F3;
}

</style>
