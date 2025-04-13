<script setup>
import { ref } from 'vue'
import Background from "@/components/Background.vue";
import AI from "@/components/AI.vue";
import Photo from "@/components/Photo.vue";
import TextEditor from "@/components/TextEditor.vue";


const emit = defineEmits(['add-element', 'update-element'])

const shapes = [
  { id: 'rectangle',  icon: '⬜' },
  { id: 'circle', icon: '⭕' },
  { id: 'triangle',  icon: '△' },
  { id: 'star', icon: '⭐' },
  { id: 'heart', icon: '❤️' }

]

const stickers = [
  { id: 'sticker1', url: '/public/11.png' },

]

const instagramStickers = [
  { id: 'link', name: 'Link', icon: '🔗' },
  { id: 'mention', name: 'Mention', icon: '@' },
  { id: 'hashtag', name: 'Hashtag', icon: '#' }
]

const activeTab = ref('shapes')

const addElement = (element) => {
  const elementToAdd = {
    ...element,
    type: element.type || element.id,
    content: element.content || element.text || 'Click to edit text'
  }
  emit('add-element', elementToAdd)
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      emit('add-element', {
        type: 'image',
        url: e.target.result,
        name: file.name
      })
    }
    reader.readAsDataURL(file)
  }
}
const selectedElement = ref(null)

const handleCreateTextBlock = ({ fontFamily, fontSize, className }) => {
  const newElement = {
    id: Date.now(),
    type: 'text',
    content: 'Введите текст',
    style: {
      fontFamily,
      fontSize,
      color: '#000000'
    },
    class: className,
    x: 100,
    y: 100,
    width: 250,
    height: 100,
    rotation: 0,
    opacity: 100,
    isNew: true,
  }

  emit('add-element', newElement)
  selectedElement.value = newElement
}

const handleTextStyleChange = ({ fontFamily, fontSize, className }) => {
  if (!selectedElement.value) return
  
  // Update the style properties
  selectedElement.value.style = {
    ...selectedElement.value.style,
    fontFamily,
    fontSize
  }
  selectedElement.value.class = className

  // Emit the updated element to the parent
  emit('update-element', { ...selectedElement.value })
}

</script>

<template>
  <div class="elements-panel">
    <div class="tabs">
      <button 
        v-for="tab in ['Элементы', 'Текст', 'stickers', 'instagram', 'upload', 'Фон', 'AI фото', 'Фото',]"
        :key="tab"
        :class="['tab-btn', { active: activeTab === tab }]"
        @click="activeTab = tab"
      >
        {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
      </button>
    </div>

    <div class="tab-content">
      <div v-if="activeTab === 'Элементы'" class="elements-grid">
        <button
          v-for="shape in shapes"
          :key="shape.id"
          class="element-btn"
          @click="addElement(shape)"
        >
          <span class="element-icon">{{ shape.icon }}</span>
        </button>
      </div>
      <TextEditor
          v-if="activeTab === 'Текст'"
          v-model="selectedElement"
          @update-text-style="handleTextStyleChange"
          @create-text-block="handleCreateTextBlock"
      />

      <div v-if="activeTab === 'stickers'" class="elements-grid">
        <button
          v-for="sticker in stickers"
          :key="index"
          class="element-btn"
          @click="addElement(sticker)"
        >
          <img :src="sticker.url" :alt="sticker.name" class="sticker-preview">
        </button>
      </div>


      <div v-if="activeTab === 'instagram'" class="elements-grid">
        <button
          v-for="sticker in instagramStickers"
          :key="sticker.id"
          class="element-btn"
          @click="addElement(sticker)"
        >
          <span class="element-icon">{{ sticker.icon }}</span>
          <span class="element-name">{{ sticker.name }}</span>
        </button>
      </div>


      <div v-if="activeTab === 'upload'" class="upload-section">
        <div class="upload-area">
          <input
            type="file"
            accept="image/*"
            @change="handleFileUpload"
            class="file-input"
            id="file-upload"
          >
          <label for="file-upload" class="upload-label">
            <span class="upload-icon">📁</span>
            <span>Upload Image</span>
          </label>
        </div>
        <div class="upload-area">
          <input
            type="file"
            accept="image/gif"
            @change="handleFileUpload"
            class="file-input"
            id="gif-upload"
          >
          <label for="gif-upload" class="upload-label">
            <span class="upload-icon">🎬</span>
            <span>Upload GIF</span>
          </label>
        </div>
      </div>


      <div v-if="activeTab === 'Фон'">
        <Background @set-background="(url) => emit('set-background', url)" />
      </div>
      <div v-if="activeTab === 'AI фото'">
        <AI/>
      </div>
      <div v-if="activeTab === 'Фото'">
        <Photo @set-background="(url) => emit('set-background', url)" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.elements-panel {
  display: flex;
  height: 100%;
}

.tabs {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #ddd;
  margin-bottom: 1rem;
  gap: 1rem;
}

.tab-btn {
  width: 70px;
  height: 70px;
  border-radius: 10px;
  background: #F3F3F3;
  border: none;
  cursor: pointer;
  font-size: 10px;
}

.tab-btn.active {
  background:  #F37021;
  color: white;
}

.tab-content {
  flex: 1;
  overflow-y: auto;
}

.elements-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  padding: 0.5rem;
}

.element-btn {
  border: none;
  background: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}


.element-icon {
  font-size: 1.5rem;
}

.element-name {
  font-size: 0.8rem;
  text-align: center;
}

.sticker-preview {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.upload-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.upload-area {
  position: relative;
  border: 2px dashed #ddd;
  border-radius: 4px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-area:hover {
  border-color: #2196F3;
  background-color: #f5f5f5;
}

.file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.upload-icon {
  font-size: 2rem;
}

</style>