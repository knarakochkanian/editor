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
import CanvasResize from './components/CanvasResize.vue'
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
    const textarea = event.target
    const lines = element.content.split('\n').length
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 20
    const newHeight = Math.max(100, lines * lineHeight + 24)
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



import html2canvas from 'html2canvas'

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
        <div class="layout-pixta-desktop-header__rotate">
          <div class="flex gap-xxxs">
            <button type="button" class="button color-secondary radius-base button--flat button--ico button--animate" @click="rotateLeft">
            <span class="button__wrapper">
              <span class="button__ico">
                <svg><use xlink:href="#ico-rotate-left"></use></svg>
              </span>
            </span>
            </button>
            <button type="button" class="button color-secondary radius-base button--flat button--ico button--animate" @click="rotateRight">
            <span class="button__wrapper">
              <span class="button__ico">
                <svg><use xlink:href="#ico-rotate-right"></use></svg>
              </span>
            </span>
            </button>
          </div>
        </div>

        <div class="flex items-center">
          <div class="text-sm text-right" style="min-width: 3em;">
            {{ scale }}%
          </div>
          <div class="flex-1" style="margin: 0 0.8em;">
            <input
                type="range"
                v-model="scale"
                min="5"
                max="300"
                class="slider"
                @input="handleScaleChange"
            >
          </div>
          <div>
            <button type="button" class="button color-secondary radius-base button--flat button--ico button--animate" @click="fitToScreen">
            <span class="button__wrapper">
              <span class="button__ico">
                <svg><use xlink:href="#ico-fit-to-screen"></use></svg>
              </span>
            </span>
            </button>
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
          <div v-if="element.type === 'text'" class="text-element" @click="handleTextClick($event, element)">
  <textarea
      v-if="store.selectedElement?.id === element.id"
      ref="textInput"
      class="text-input"
      :value="element.content"
      @input="handleTextEdit($event, element)"
      @click.stop
      @blur="element.isNew = false"
      rows="1"
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
  border-color: #F37021;
}

.layout-pixta-desktop-header {
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.button__wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

.slider {
  width: 100%;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #F37021;
  border-radius: 50%;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #F37021;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.text-sm {
  font-size: 0.875rem;
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
}

</style>
