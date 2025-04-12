<script setup>
import { ref } from 'vue'
import Elements from './components/Elements.vue'
import ColorPalette from './components/ColorPalette.vue'
import Alignment from './components/Alignment.vue'
import Properties from './components/Properties.vue'
import Header from "@/components/Header.vue";

const backgroundImage = ref(null)


const handleSetBackground = (url) => {
  backgroundImage.value = url
}

const canvasSize = ref({
  width: 720,
  height: 720
})

const orientation = ref('landscape')
const selectedElement = ref(null)
const elements = ref([])


const handleAddElement = (element) => {
  const isText = element.type === 'text' || element.id === 'text'

  const newElement = {
    id: Date.now(),
    type: element.type || element.id,
    content: '',
    style: element.style || '',
    x: 50,
    y: 50,
    width: 200,
    height: 100,
    rotation: 0,
    opacity: 100,
    isNew: isText,
    ...element
  }

  // Parse style string into object if it's a string
  if (typeof newElement.style === 'string') {
    const styleObj = {}
    newElement.style.split(';').forEach(style => {
      if (style.trim()) {
        const [key, value] = style.split(':').map(s => s.trim())
        styleObj[key.replace(/-([a-z])/g, g => g[1].toUpperCase())] = value
      }
    })
    newElement.style = styleObj
  }

  elements.value.push(newElement)
  selectedElement.value = newElement
}

const handleElementSelect = (element) => {
  selectedElement.value = element
}

const handleTextEdit = (event, element) => {
  element.content = event.target.value
}

const handleTextClick = (event, element) => {
  event.stopPropagation()
  selectedElement.value = element
}

const handleElementUpdate = (updatedElement) => {
  const index = elements.value.findIndex(el => el.id === updatedElement.id)
  if (index !== -1) {
    elements.value[index] = updatedElement
  }
}

const handleAlignment = (alignment) => {
  if (!selectedElement.value) return
  
  const element = selectedElement.value
  const container = document.querySelector('.content-area')
  const containerRect = container.getBoundingClientRect()
  
  switch (alignment) {
    case 'top-left':
      element.x = 0
      element.y = 0
      break
    case 'top-center':
      element.x = (containerRect.width - element.width) / 2
      element.y = 0
      break
    case 'top-right':
      element.x = containerRect.width - element.width
      element.y = 0
      break
    case 'middle-left':
      element.x = 0
      element.y = (containerRect.height - element.height) / 2
      break
    case 'middle-center':
      element.x = (containerRect.width - element.width) / 2
      element.y = (containerRect.height - element.height) / 2
      break
    case 'middle-right':
      element.x = containerRect.width - element.width
      element.y = (containerRect.height - element.height) / 2
      break
    case 'bottom-left':
      element.x = 0
      element.y = containerRect.height - element.height
      break
    case 'bottom-center':
      element.x = (containerRect.width - element.width) / 2
      element.y = containerRect.height - element.height
      break
    case 'bottom-right':
      element.x = containerRect.width - element.width
      element.y = containerRect.height - element.height
      break
  }
}


const handleSchedulePost = () => {
  console.log('Scheduling post')
}

const handleDownload = () => {

  const layoutData = {
    size: canvasSize.value,
    orientation: orientation.value,
    elements: elements.value
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

const handleUndo = () => {

  console.log('Undoing last action')
}

const handleRedo = () => {

  console.log('Redoing last action')
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
        <div v-if="elements.length === 0" class="placeholder-content">
          <h2>Content Area</h2>
          <p>Add elements from the left panel to start creating your design</p>
        </div>
        <div
          v-for="element in elements"
          :key="element.id"
          class="content-element"
          :class="['content-element', element.class, { selected: selectedElement?.id === element.id }]"
          :style="{
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
  v-if="selectedElement?.id === element.id"
  type="text"
  v-model="element.content"
  ref="textInput"
  class="text-input"
  @blur="element.isNew = false"
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
    </div>


    <div class="right-panel">
      <Alignment @align="handleAlignment" />
      <ColorPalette />
      <Properties 
        :selected-element="selectedElement"
        @update="handleElementUpdate"
      />
    </div>
  </div>
</template>

<style scoped>
.editor-container {
  display: grid;
  grid-template-columns: 450px 1fr 300px;
  height: 100vh;
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
  color: #333;
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
  background-color: #F37021;
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
