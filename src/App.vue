<script setup>
import {onMounted, onUnmounted, ref} from 'vue'
import Elements from './components/Elements.vue'
import ColorPalette from './components/ColorPalette.vue'
import Alignment from './components/Alignment.vue'
import Properties from './components/Properties.vue'
import TextColorPicker from './components/TextColorPicker.vue'
import TextProperties from './components/TextProperties.vue'
import Header from "@/components/Header.vue";
import ElementControls from './components/ElementControls.vue'
import {useElementStore} from './stores/elementStore'
import html2canvas from 'html2canvas'

const store = useElementStore()
const backgroundImage = ref(null)

const handleSetBackground = (url) => {
  backgroundImage.value = url
}

const originalDimensions = ref({
  width: 620,
  height: 520
})

const canvasSize = ref({
  width: originalDimensions.value.width,
  height: originalDimensions.value.height
})

const orientation = ref('landscape')

const handleAddElement = (element) => {
  store.addElement(element)
}


const handleElementSelect = (element) => {
  store.setSelectedElement(element)
}

const handleTextEdit = (event, element) => {
  const newContent = event.target.value
  const textarea = event.target
  const lines = newContent.split('\n').length
  const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 20
  const newHeight = Math.max(100, lines * lineHeight + 24)

  const updatedElement = {
    ...element,
    content: newContent,
    height: newHeight,
    isEditing: true,
    style: {
      ...element.style,
      color: element.style?.color || '#000000',
      backgroundColor: element.style?.backgroundColor || 'transparent',
      fontFamily: element.style?.fontFamily || 'Arial',
      fontSize: element.style?.fontSize || '16px',
      lineHeight: element.style?.lineHeight || 1.5,
      letterSpacing: element.style?.letterSpacing || 0
    }
  }

  store.updateElement(updatedElement)
}

const handleTextClick = (event, element) => {
  event.stopPropagation()
  store.setSelectedElement(element)
}

const handleTextDoubleClick = (event, element) => {
  event.stopPropagation()
  store.setSelectedElement(element)
  element.isEditing = true
  
  store.updateElement({ ...element })
  
  setTimeout(() => {
    const textarea = event.target.closest('.text-element').querySelector('textarea')
    if (textarea) {
      textarea.focus()
      const length = textarea.value.length
      textarea.setSelectionRange(length, length)
    }
  }, 0)
}

const handleTextBlur = (element) => {
  element.isEditing = false
  store.updateElement({ ...element })
}

const handleElementUpdate = (updatedElement) => {
  store.updateElement(updatedElement)
}

const handleAlignment = (alignment) => {
  if (!store.selectedElement) return

  const element = {
    id: Date.now(),
    type,
    content: '',
    x: 100,
    y: 100,
    width: 150,
    height: 150,
    rotation: 0,
    opacity: 100,

  }

  const contentArea = document.querySelector('.content-area')
  const contentRect = contentArea.getBoundingClientRect()


  const padding = 24
  const availableWidth = contentRect.width - (padding * 2)
  const availableHeight = contentRect.height - (padding * 2)

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

  store.updateElement(element)
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
  event.preventDefault()
  event.stopPropagation()

  const startX = event.clientX
  const startY = event.clientY
  const initialX = element.x
  const initialY = element.y

  const contentArea = document.querySelector('.content-area')
  const canvasRect = contentArea.getBoundingClientRect()

  const drag = (e) => {
    const deltaX = e.clientX - startX
    const deltaY = e.clientY - startY

    let newX = initialX + deltaX
    let newY = initialY + deltaY

    // Ограничения по ширине и высоте канваса
    const maxX = canvasRect.width - element.width
    const maxY = canvasRect.height - element.height

    element.x = Math.max(0, Math.min(newX, maxX))
    element.y = Math.max(0, Math.min(newY, maxY))
  }

  const stopDrag = () => {
    document.removeEventListener('mousemove', drag)
    document.removeEventListener('mouseup', stopDrag)
    store.updateElement({ ...element })
  }

  document.addEventListener('mousemove', drag)
  document.addEventListener('mouseup', stopDrag)
}


const downloadAsPNG = async () => {
  const content = document.querySelector('.content-area')
  if (!content) return

  const canvas = await html2canvas(content, {
    scale: 2,
    useCORS: true
  })

  const imgData = canvas.toDataURL('image/png')

  const a = document.createElement('a')
  a.href = imgData
  a.download = 'layout.png'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
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

    [store.elements[index], store.elements[index + 1]] = [store.elements[index + 1], store.elements[index]]
  } else if (direction === 'down' && index > 0) {
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

const handleCanvasResize = ({ width, height, isProportional }) => {
  const scaleX = width / canvasSize.value.width
  const scaleY = height / canvasSize.value.height

  const newWidth = parseInt(width)
  const newHeight = parseInt(height)

  console.log('Resizing canvas to:', { width: newWidth, height: newHeight })

  canvasSize.value = {
    width: newWidth,
    height: newHeight
  }

  if (isProportional) {
    store.elements.forEach(element => {
      const updatedElement = {
        ...element,
        x: Math.round(element.x * scaleX),
        y: Math.round(element.y * scaleY),
        width: Math.round(element.width * scaleX),
        height: Math.round(element.height * scaleY)
      }
      store.updateElement(updatedElement)
    })
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
const startResize = (event, element, direction) => {
  event.stopPropagation()
  const startX = event.clientX
  const startY = event.clientY
  const startWidth = element.width
  const startHeight = element.height
  const startLeft = element.x
  const startTop = element.y

  const resize = (e) => {
    const deltaX = e.clientX - startX
    const deltaY = e.clientY - startY

    switch (direction) {
      case 'br': // bottom-right
        element.width = Math.max(20, startWidth + deltaX)
        element.height = Math.max(20, startHeight + deltaY)
        break
      case 'bl': // bottom-left
        element.x = startLeft + deltaX
        element.width = Math.max(20, startWidth - deltaX)
        element.height = Math.max(20, startHeight + deltaY)
        break
      case 'tr': // top-right
        element.y = startTop + deltaY
        element.height = Math.max(20, startHeight - deltaY)
        element.width = Math.max(20, startWidth + deltaX)
        break
      case 'tl': // top-left
        element.x = startLeft + deltaX
        element.y = startTop + deltaY
        element.width = Math.max(20, startWidth - deltaX)
        element.height = Math.max(20, startHeight - deltaY)
        break
      case 'ml': // middle-left
        element.x = startLeft + deltaX
        element.width = Math.max(20, startWidth - deltaX)
        break
      case 'mr': // middle-right
        element.width = Math.max(20, startWidth + deltaX)
        break
      case 'tm': // top-middle
        element.y = startTop + deltaY
        element.height = Math.max(20, startHeight - deltaY)
        break
      case 'bm': // bottom-middle
        element.height = Math.max(20, startHeight + deltaY)
        break
    }
  }

  const stopResize = () => {
    document.removeEventListener('mousemove', resize)
    document.removeEventListener('mouseup', stopResize)
    store.updateElement({ ...element })
  }

  document.addEventListener('mousemove', resize)
  document.addEventListener('mouseup', stopResize)
}

const scale = ref(100)

const handleScaleChange = () => {
  const scaleValue = Math.min(Math.max(scale.value, 5), 100)
  const contentArea = document.querySelector('.content-area')
  const mainContent = document.querySelector('.main-content')
  
  if (contentArea && mainContent) {
    const mainContentWidth = mainContent.clientWidth
    const mainContentHeight = mainContent.clientHeight

    const aspectRatio = originalDimensions.value.height / originalDimensions.value.width
    let newWidth = Math.round((originalDimensions.value.width * scaleValue) / 100)
    let newHeight = Math.round(newWidth * aspectRatio)

    if (newWidth > mainContentWidth) {
      newWidth = mainContentWidth
      newHeight = Math.round(newWidth * aspectRatio)
    }

    if (newHeight > mainContentHeight) {
      const heightRatio = mainContentHeight / newHeight
      newHeight = mainContentHeight
      newWidth = Math.round(newWidth * heightRatio)
    }
    
    canvasSize.value = {
      width: newWidth,
      height: newHeight
    }
  }
}

const fitToScreen = () => {
  const mainContent = document.querySelector('.main-content')
  if (mainContent) {
    const mainContentWidth = mainContent.clientWidth
    const mainContentHeight = mainContent.clientHeight
    const aspectRatio = originalDimensions.value.height / originalDimensions.value.width
    
    let newWidth = mainContentWidth
    let newHeight = Math.round(newWidth * aspectRatio)

    if (newHeight > mainContentHeight) {
      const heightRatio = mainContentHeight / newHeight
      newHeight = mainContentHeight
      newWidth = Math.round(newWidth * heightRatio)
    }
    
    canvasSize.value = {
      width: newWidth,
      height: newHeight
    }
    scale.value = 100
  }
}

const rotateLeft = () => {
  const newWidth = canvasSize.value.height
  const newHeight = canvasSize.value.width
  canvasSize.value = {
    width: newWidth,
    height: newHeight
  }
}

const rotateRight = () => {
  const newWidth = canvasSize.value.height
  const newHeight = canvasSize.value.width
  canvasSize.value = {
    width: newWidth,
    height: newHeight
  }
}
</script>

<template>
  <Header @download-pdf="downloadAsPNG" />
  <div class="editor-container">
    <div class="left-panel">
      <Elements
        @add-element="handleAddElement"
        @set-background="handleSetBackground"
        @resize-canvas="handleCanvasResize"
      />
    </div>

    <div class="main-content">
      <div class="layout-pixta-desktop-header">
        <div class="flex items-center">
          <div class="text-sm text-right" style="min-width: 3em;">
            {{ scale }}%
          </div>
          <div class="flex-1" style="margin: 0 0.8em;">
            <div class="ngx-slider-wrapper">
              <span class="ngx-slider-span ngx-slider-bar-wrapper ngx-slider-full-bar">
                <span class="ngx-slider-span ngx-slider-bar" :style="{ width: `${scale}%` }"></span>
              </span>
              <input
                type="range"
                v-model="scale"
                min="5"
                max="100"
                class="slider"
                @input="handleScaleChange"
              />
            </div>
          </div>
        </div>
      </div>
      <div
          class="content-area"
          :style="{
            width: canvasSize.width + 'px',
            height: canvasSize.height + 'px',
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'width 0.3s, height 0.3s'
          }"
      >
        <div v-if="store.elements.length === 0" class="placeholder-content">
          <h2>Область содержимого</h2>
          <p>Добавьте элементы с левой панели, чтобы начать создавать свой дизайн</p>
        </div>
        <div
            v-for="element in store.elements"
            @mousedown="startDrag($event, element)"
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
            @click="handleElementSelect(element)"
        >
          <div v-if="store.selectedElement?.id === element.id">
            <div class="resize-handle handle-tl" @mousedown="(e) => startResize(e, element, 'tl')"></div>
            <div class="resize-handle handle-tm" @mousedown="(e) => startResize(e, element, 'tm')"></div>
            <div class="resize-handle handle-tr" @mousedown="(e) => startResize(e, element, 'tr')"></div>
            <div class="resize-handle handle-ml" @mousedown="(e) => startResize(e, element, 'ml')"></div>
            <div class="resize-handle handle-mr" @mousedown="(e) => startResize(e, element, 'mr')"></div>
            <div class="resize-handle handle-bl" @mousedown="(e) => startResize(e, element, 'bl')"></div>
            <div class="resize-handle handle-bm" @mousedown="(e) => startResize(e, element, 'bm')"></div>
            <div class="resize-handle handle-br" @mousedown="(e) => startResize(e, element, 'br')"></div>
          </div>
          <div v-if="element.type === 'text'" 
               class="text-element" 
               @click="handleTextClick($event, element)"
               @dblclick="handleTextDoubleClick($event, element)">
            <textarea
                v-if="store.selectedElement?.id === element.id && element.isEditing"
                ref="textInput"
                class="text-input"
                v-model="element.content"
                @input="handleTextEdit($event, element)"
                @blur="handleTextBlur(element)"
                @keydown.enter.prevent="handleTextBlur(element)"
                rows="1"
                :style="{
                  fontFamily: element.style?.fontFamily || 'Arial',
                  fontSize: element.style?.fontSize || '16px',
                  color: element.style?.color || '#000000',
                  lineHeight: element.style?.lineHeight || '1.5',
                  letterSpacing: element.style?.letterSpacing || '0px',
                  backgroundColor: element.style?.backgroundColor || 'transparent',
                  textAlign: 'center'
                }"
            />
            <span v-else :style="{
              fontFamily: element.style?.fontFamily || 'Arial',
              fontSize: element.style?.fontSize || '16px',
              color: element.style?.color || '#000000',
              lineHeight: element.style?.lineHeight || '1.5',
              letterSpacing: element.style?.letterSpacing || '0px',
              backgroundColor: element.style?.backgroundColor || 'transparent',
              textAlign: 'center'
            }">{{ element.content }}</span>
          </div>

          <div v-else-if="element.type === 'rectangle'" class="shape-element rectangle"></div>
          <div v-else-if="element.type === 'circle'" class="shape-element circle"></div>
          <div v-else-if="element.type === 'triangle'" class="shape-element triangle"></div>
          <div v-else-if="element.type === 'star'" class="shape-element star"></div>
          <div v-else-if="element.type === 'heart'" class="shape-element heart"></div>


          <div v-else-if="element.type === 'image'" class="phone-mockup">
            <div class="phone-frame">
              <div class="phone-notch"></div>
              <div class="phone-screen">
                <img :src="element.url" :alt="element.name" class="image-element">
              </div>
              <div class="phone-home-button"></div>
            </div>
          </div>
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
  background-color: #F5F5F5;
}

.left-panel, .right-panel {
  background-color: white;
  border-right: 1px solid #E0E0E0;
  overflow-y: auto;
  padding-left: 20px;
}

.right-panel {
  border-right: none;
  border-left: 1px solid #E0E0E0;
}

.main-content {
  padding: 20px;
  background-color: #F5F5F5;
  max-width: 100%;
  overflow: hidden;
  position: relative;
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
  transition: width 0.3s, height 0.3s;
  max-width: 100%;
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
  outline: 2px solid #F37021;
}

.text-element {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
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
  resize: none;
  text-align: center;
  outline: none;
  padding: 0;
  margin: 0;
  line-height: 1.4;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  cursor: text;
  z-index: 1;
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

.phone-mockup {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.phone-frame {
  width: 100%;
  height: 100%;
  background: #1a1a1a;
  border-radius: 40px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  box-shadow: 0 0 0 2px #333, 0 0 0 6px #1a1a1a;
}

.phone-notch {
  width: 40%;
  height: 20px;
  background: #1a1a1a;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.phone-screen {
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 30px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.phone-home-button {
  width: 30px;
  height: 30px;
  background: #1a1a1a;
  border: 2px solid #333;
  border-radius: 50%;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.image-element {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
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
  border-color: #F37021;
}

.layout-pixta-desktop-header {
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  max-width: 100%;
  margin: 0 auto;
}
.ngx-slider-wrapper {
  position: relative;
  width: 100%;
  max-width: 300px;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  margin: 0 auto;
}

.ngx-slider-span {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.ngx-slider-bar-wrapper {
  opacity: 1;
  visibility: visible;
  transform: rotate(0deg);
  overflow: hidden;
}

.ngx-slider-bar {
  background: #F37021;
  border-radius: 2px;
  transition: width 0.2s ease;
  height: 100%;
}

.slider {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  -webkit-appearance: none;
  background: transparent;
  margin: 0;
  padding: 0;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #F37021;
  border-radius: 50%;
  cursor: pointer;
  margin-top: -6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #F37021;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.text-sm {
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
  min-width: 40px;
  text-align: right;
}

.flex {
  display: flex;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
}

.flex-1 {
  flex: 1;
  min-width: 0;
  max-width: 300px;
}

.resize-handle {
  width: 10px;
  height: 10px;
  background: #F37021;
  border-radius: 50%;
  position: absolute;
  z-index: 10;
}

.handle-tl { top: -5px; left: -5px; cursor: nwse-resize; }
.handle-tm { top: -5px; left: 50%; transform: translateX(-50%); cursor: ns-resize; }
.handle-tr { top: -5px; right: -5px; cursor: nesw-resize; }
.handle-ml { top: 50%; left: -5px; transform: translateY(-50%); cursor: ew-resize; }
.handle-mr { top: 50%; right: -5px; transform: translateY(-50%); cursor: ew-resize; }
.handle-bl { bottom: -5px; left: -5px; cursor: nesw-resize; }
.handle-bm { bottom: -5px; left: 50%; transform: translateX(-50%); cursor: ns-resize; }
.handle-br { bottom: -5px; right: -5px; cursor: nwse-resize; }

.resize-handle:hover {
  background: #FF8C42;
}

</style>
