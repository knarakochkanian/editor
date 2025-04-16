<script setup>
import { ref } from 'vue'
import Background from "@/components/Background.vue";
import AI from "@/components/AI.vue";
import Photo from "@/components/Photo.vue";
import TextEditor from "@/components/TextEditor.vue";


const emit = defineEmits(['add-element', 'update-element'])

const shapes = [
  { id: 'shape1', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/shape/001.png' },
  { id: 'shape2', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/shape/002.png' },
  { id: 'shape3', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/shape/003.png' }
]

const arrows = [
  { id: 'arrow1', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/arrow/018.png' },
  { id: 'arrow2', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/arrow/019.png' },
  { id: 'arrow3', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/arrow/020.png' }
]

const scopes = [
  { id: 'scope1', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/scope/001.png' },
  { id: 'scope2', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/scope/002.png' },
  { id: 'scope3', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/scope/003.png' }
]

const abstractShapes = [
  { id: 'abstract1', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/abstract/F1-1.png' },
  { id: 'abstract2', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/abstract/F1-2.png' },
  { id: 'abstract3', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/abstract/F1-3.png' }
]

const brushes = [
  { id: 'brush1', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/brush/F1-1.png' },
  { id: 'brush2', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/brush/F1-2.png' },
  { id: 'brush3', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/brush/F1-3.png' }
]

const hearts = [
  { id: 'heart1', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/heart/001.png' },
  { id: 'heart2', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/heart/002.png' },
  { id: 'heart3', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/heart/003.png' }
]

const discountBadges = [
  { id: 'badge1', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/discount-badges/1080x1080-27240044.png' },
  { id: 'badge2', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/discount-badges/1080x1080-27240046.png' },
  { id: 'badge3', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/discount-badges/1080x1080-27240070.png' }
]

const priceTags = [
  { id: 'tag1', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/price-tags/1080x1080-27253460.png' },
  { id: 'tag2', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/price-tags/1080x1080-27253461.png' },
  { id: 'tag3', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/price-tags/1080x1080-27253462.png' }
]

const gifs = [
  { id: 'gif1', url: 'https://ycs-media.postmypost.io/pixta-assets/gif-general/preview/gif_general_1.gif' },
  { id: 'gif2', url: 'https://ycs-media.postmypost.io/pixta-assets/gif-general/preview/gif_general_2.gif' },
  { id: 'gif3', url: 'https://ycs-media.postmypost.io/pixta-assets/gif-general/preview/gif_general_3.gif' }
]

const gifArrows = [
  { id: 'gifArrow1', url: 'https://ycs-media.postmypost.io/pixta-assets/gif-arrow/preview/QAO7ATbYfg6HFPgkS0.gif' },
  { id: 'gifArrow2', url: 'https://ycs-media.postmypost.io/pixta-assets/gif-arrow/preview/S7R5EC5FXdk02AwcOc.gif' },
  { id: 'gifArrow3', url: 'https://ycs-media.postmypost.io/pixta-assets/gif-arrow/preview/iJzVmJOgK1RCbC9aRh.gif' }
]

const stickers = [
  { id: 'sticker1', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/instagram-sticker/preview/639b049d02b2b.png' },
  { id: 'sticker2', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/instagram-sticker/preview/639b04abbc838.png' },
  { id: 'sticker3', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/instagram-sticker/preview/639b04d603b9e.png' },
  { id: 'sticker4', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/social-network-sticker/social-vkontakte-story-hashtag-ru.png' },
  { id: 'sticker5', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/social-network-sticker/social-vkontakte-story-question-ru.png' },
  { id: 'sticker6', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/social-network-sticker/social-vkontakte-story-poll-ru.png' },
  { id: 'sticker7', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/social-network-sticker/social-vkontakte-story-mention-ru.png' },
  { id: 'sticker8', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/social-network-sticker/social-vkontakte-story-link-ru.png' },
  { id: 'sticker9', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/social-network-sticker/social-vkontakte-story-cta-ru.png' },
  { id: 'sticker10', url: 'https://ycs-media.postmypost.io/r/150x600/pixta-assets/social-network-sticker/social-vkontakte-story-repost.png' }
]

const instagramStickers = [
  { id: 'link', icon: '🔗', color: '#0095f6' },
  { id: 'mention', icon: '@', color: '#8e3ea4' },
  { id: 'hashtag', icon: '#', color: '#ed4956' },
  { id: 'location', icon: '📍', color: '#4caf50' },
  { id: 'music', icon: '🎵', color: '#ff9800' },
  { id: 'poll', icon: '📊', color: '#2196f3' },
  { id: 'question', icon: '❓', color: '#9c27b0' },
  { id: 'countdown', icon: '⏳', color: '#f44336' },
  { id: 'quiz', icon: '🎯', color: '#00bcd4' },
  { id: 'slider', icon: '🎚️', color: '#ff5722' }
]

const templates = [
  { id: 'template1', preview: '/public/template1.png' },
  { id: 'template2', preview: '/public/template2.png' },
  { id: 'template3', preview: '/public/template3.png' }
]

const activeTab = ref('shapes')

const addElement = (type) => {
  let element = {
    id: Date.now(),
    type,
    content: '',
    style: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: '200px',
      height: '200px',
      backgroundColor: '#F37021',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'move',
      userSelect: 'none',
      borderRadius: '0',
      backgroundImage: 'none',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    }
  }

  // Handle different element types
  if (type.startsWith('shape')) {
    const shape = shapes.find(s => s.id === type)
    if (shape) {
      element.style.backgroundImage = `url(${shape.url})`
      element.style.backgroundColor = 'transparent'
    }
  } else if (type.startsWith('arrow')) {
    const arrow = arrows.find(a => a.id === type)
    if (arrow) {
      element.style.backgroundImage = `url(${arrow.url})`
      element.style.backgroundColor = 'transparent'
    }
  } else if (type.startsWith('scope')) {
    const scope = scopes.find(s => s.id === type)
    if (scope) {
      element.style.backgroundImage = `url(${scope.url})`
      element.style.backgroundColor = 'transparent'
    }
  } else if (type.startsWith('abstract')) {
    const abstract = abstractShapes.find(a => a.id === type)
    if (abstract) {
      element.style.backgroundImage = `url(${abstract.url})`
      element.style.backgroundColor = 'transparent'
    }
  } else if (type.startsWith('brush')) {
    const brush = brushes.find(b => b.id === type)
    if (brush) {
      element.style.backgroundImage = `url(${brush.url})`
      element.style.backgroundColor = 'transparent'
    }
  } else if (type.startsWith('heart')) {
    const heart = hearts.find(h => h.id === type)
    if (heart) {
      element.style.backgroundImage = `url(${heart.url})`
      element.style.backgroundColor = 'transparent'
    }
  } else if (type.startsWith('badge')) {
    const badge = discountBadges.find(b => b.id === type)
    if (badge) {
      element.style.backgroundImage = `url(${badge.url})`
      element.style.backgroundColor = 'transparent'
    }
  } else if (type.startsWith('tag')) {
    const tag = priceTags.find(t => t.id === type)
    if (tag) {
      element.style.backgroundImage = `url(${tag.url})`
      element.style.backgroundColor = 'transparent'
    }
  } else if (type.startsWith('gif')) {
    const gif = gifs.find(g => g.id === type)
    if (gif) {
      element.style.backgroundImage = `url(${gif.url})`
      element.style.backgroundColor = 'transparent'
    }
  } else if (type.startsWith('gifArrow')) {
    const gifArrow = gifArrows.find(g => g.id === type)
    if (gifArrow) {
      element.style.backgroundImage = `url(${gifArrow.url})`
      element.style.backgroundColor = 'transparent'
    }
  } else if (type.startsWith('sticker')) {
    const sticker = stickers.find(s => s.id === type)
    if (sticker) {
      element.style.backgroundImage = `url(${sticker.url})`
      element.style.backgroundColor = 'transparent'
    }
  } else if (type === 'link' || type === 'mention' || type === 'hashtag' || 
             type === 'location' || type === 'music' || type === 'poll' || 
             type === 'question' || type === 'countdown' || type === 'quiz' || 
             type === 'slider') {
    const sticker = instagramStickers.find(s => s.id === type)
    if (sticker) {
      element.style.backgroundColor = sticker.color
      element.style.color = 'white'
      element.style.fontSize = '24px'
      element.content = sticker.icon
      element.style.display = 'flex'
      element.style.alignItems = 'center'
      element.style.justifyContent = 'center'
    }
  }

  emit('add-element', element)
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
        v-for="tab in ['Элементы', 'Текст', 'stickers', 'instagram', 'upload', 'Фон', 'AI фото', 'Фото', 'Шаблоны']"
        :key="tab"
        :class="['tab-btn', { active: activeTab === tab }]"
        @click="activeTab = tab"
      >
        {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
      </button>
    </div>

    <div class="tab-content">
      <div v-if="activeTab === 'Элементы'" class="elements-section">
        <div class="elements-group">
          <h3 class="elements-title">Shapes</h3>
          <div class="elements-grid">
            <button
              v-for="shape in shapes"
              :key="shape.id"
              class="element-btn shape-btn"
              @click="addElement(shape.id)"
            >
              <img :src="shape.url" :alt="shape.id" class="element-preview">
            </button>
          </div>
        </div>

        <div class="elements-group">
          <h3 class="elements-title">Arrows</h3>
          <div class="elements-grid">
            <button
              v-for="arrow in arrows"
              :key="arrow.id"
              class="element-btn arrow-btn"
              @click="addElement(arrow.id)"
            >
              <img :src="arrow.url" :alt="arrow.id" class="element-preview">
            </button>
          </div>
        </div>

        <div class="elements-group">
          <h3 class="elements-title">Scopes</h3>
          <div class="elements-grid">
            <button
              v-for="scope in scopes"
              :key="scope.id"
              class="element-btn scope-btn"
              @click="addElement(scope.id)"
            >
              <img :src="scope.url" :alt="scope.id" class="element-preview">
            </button>
          </div>
        </div>

        <div class="elements-group">
          <h3 class="elements-title">Abstract shapes</h3>
          <div class="elements-grid">
            <button
              v-for="shape in abstractShapes"
              :key="shape.id"
              class="element-btn abstract-btn"
              @click="addElement(shape.id)"
            >
              <img :src="shape.url" :alt="shape.id" class="element-preview">
            </button>
          </div>
        </div>

        <div class="elements-group">
          <h3 class="elements-title">Brushes</h3>
          <div class="elements-grid">
            <button
              v-for="brush in brushes"
              :key="brush.id"
              class="element-btn brush-btn"
              @click="addElement(brush.id)"
            >
              <img :src="brush.url" :alt="brush.id" class="element-preview">
            </button>
          </div>
        </div>

        <div class="elements-group">
          <h3 class="elements-title">Heart</h3>
          <div class="elements-grid">
            <button
              v-for="heart in hearts"
              :key="heart.id"
              class="element-btn heart-btn"
              @click="addElement(heart.id)"
            >
              <img :src="heart.url" :alt="heart.id" class="element-preview">
            </button>
          </div>
        </div>

        <div class="elements-group">
          <h3 class="elements-title">Discount badges</h3>
          <div class="elements-grid">
            <button
              v-for="badge in discountBadges"
              :key="badge.id"
              class="element-btn badge-btn"
              @click="addElement(badge.id)"
            >
              <img :src="badge.url" :alt="badge.id" class="element-preview">
            </button>
          </div>
        </div>

        <div class="elements-group">
          <h3 class="elements-title">Price tags</h3>
          <div class="elements-grid">
            <button
              v-for="tag in priceTags"
              :key="tag.id"
              class="element-btn tag-btn"
              @click="addElement(tag.id)"
            >
              <img :src="tag.url" :alt="tag.id" class="element-preview">
            </button>
          </div>
        </div>

        <div class="elements-group">
          <h3 class="elements-title">GIF</h3>
          <div class="elements-grid">
            <button
              v-for="gif in gifs"
              :key="gif.id"
              class="element-btn gif-btn"
              @click="addElement(gif.id)"
            >
              <img :src="gif.url" :alt="gif.id" class="element-preview">
            </button>
          </div>
        </div>

        <div class="elements-group">
          <h3 class="elements-title">GIF arrows</h3>
          <div class="elements-grid">
            <button
              v-for="arrow in gifArrows"
              :key="arrow.id"
              class="element-btn gif-arrow-btn"
              @click="addElement(arrow.id)"
            >
              <img :src="arrow.url" :alt="arrow.id" class="element-preview">
            </button>
          </div>
        </div>
      </div>

      <TextEditor
        v-if="activeTab === 'Текст'"
        v-model="selectedElement"
        @update-text-style="handleTextStyleChange"
        @create-text-block="handleCreateTextBlock"
      />

      <div v-if="activeTab === 'stickers'" class="stickers-section">
        <div class="stickers-group">
          <h3 class="stickers-title">Instagram stickers</h3>
          <div class="elements-grid">
            <button
              v-for="sticker in stickers.slice(0, 3)"
              :key="sticker.id"
              class="element-btn sticker-btn"
              @click="addElement(sticker.id)"
            >
              <img :src="sticker.url" :alt="sticker.id" class="sticker-preview">
            </button>
          </div>
        </div>

        <div class="stickers-group">
          <h3 class="stickers-title">VKontakte stories objects</h3>
          <div class="elements-grid">
            <button
              v-for="sticker in stickers.slice(3)"
              :key="sticker.id"
              class="element-btn sticker-btn"
              @click="addElement(sticker.id)"
            >
              <img :src="sticker.url" :alt="sticker.id" class="sticker-preview">
            </button>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'instagram'" class="elements-grid">
        <button
          v-for="sticker in instagramStickers"
          :key="sticker.id"
          class="element-btn instagram-btn"
          @click="addElement(sticker.id)"
          :style="{ '--sticker-color': sticker.color }"
        >
          <span class="element-icon">{{ sticker.icon }}</span>
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
            <span>Загрузить изображение</span>
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
            <span>Загрузить GIF</span>
          </label>
        </div>
      </div>

      <div v-if="activeTab === 'Фон'">
        <Background @set-background="(url) => emit('set-background', url)" />
      </div>

      <div v-if="activeTab === 'AI фото'">
        <AI />
      </div>

      <div v-if="activeTab === 'Фото'">
        <Photo @set-background="(url) => emit('set-background', url)" />
      </div>

      <div v-if="activeTab === 'Шаблоны'" class="templates-grid">
        <div
          v-for="template in templates"
          :key="template.id"
          class="template-item"
          @click="applyTemplate(template.id)"
        >
          <img :src="template.preview" :alt="template.id" class="template-preview">
        </div>
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
  background: #F37021;
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
  position: relative;
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

.templates-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 1rem;
}

.template-item {
  position: relative;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
}

.template-item:hover {
  transform: scale(1.02);
}

.template-preview {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.template-name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem;
  text-align: center;
}

.element-description {
  font-size: 0.7rem;
  color: #666;
  text-align: center;
  margin-top: 0.25rem;
}

.sticker-btn {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 0.5rem;
}

.sticker-btn:hover {
  background: #e0e0e0;
  transform: scale(1.05);
}

.instagram-btn {
  background: white;
  border: 1px solid #dbdbdb;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.instagram-btn:hover {
  background: var(--sticker-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.instagram-btn:hover .element-icon {
  transform: scale(1.2);
}

.instagram-btn:hover .element-description {
  color: white;
}

.element-icon {
  font-size: 1.5rem;
  transition: transform 0.3s ease;
}

.element-description {
  font-size: 0.7rem;
  color: #666;
  text-align: center;
  margin-top: 0.25rem;
  transition: color 0.3s ease;
}

.stickers-section {
  padding: 1rem;
}

.stickers-group {
  margin-bottom: 2rem;
}

.stickers-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.sticker-btn {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.sticker-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-color: #F37021;
}

.sticker-preview {
  width: 100%;
  height: 100px;
  object-fit: contain;
  margin-bottom: 0.5rem;
}

.elements-section {
  padding: 1rem;
}

.elements-group {
  margin-bottom: 2rem;
}

.elements-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.element-preview {
  width: 100%;
  height: 100px;
  object-fit: contain;
  margin-bottom: 0.5rem;
}

.shape-btn,
.arrow-btn,
.scope-btn,
.abstract-btn,
.brush-btn,
.heart-btn,
.badge-btn,
.tag-btn,
.gif-btn,
.gif-arrow-btn {
  background: #F3F3F3;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.shape-btn:hover,
.arrow-btn:hover,
.scope-btn:hover,
.abstract-btn:hover,
.brush-btn:hover,
.heart-btn:hover,
.badge-btn:hover,
.tag-btn:hover,
.gif-btn:hover,
.gif-arrow-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-color: #F37021;
}
</style>