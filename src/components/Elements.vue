<script setup>
import { ref } from 'vue'
import Background from "@/components/Background.vue";
import AI from "@/components/AI.vue";
import TextEditor from "@/components/TextEditor.vue";
import CanvasResize from "@/components/CanvasResize.vue"


const emit = defineEmits(['add-element', 'set-background', 'resize-canvas'])

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

const photos = [
  'public/backgrounds/foto1.jpeg',
  'public/backgrounds/foto2.jpeg',
  'public/backgrounds/foto3.jpeg',
  'public/backgrounds/foto4.jpeg'
]


const activeTab = ref('shapes')

const addElement = (type) => {
  if (type === 'text') {
    console.warn('Текстовые блоки создаются через handleCreateTextBlock')
    return
  }

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
    style: {
      position: 'absolute',
      backgroundColor: 'transparent',
      backgroundImage: 'none',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'move',
      userSelect: 'none'
    }
  }

  const getUrlFromGroup = (group) => group.find(el => el.id === type)?.url

  const url =
      getUrlFromGroup(shapes) ||
      getUrlFromGroup(arrows) ||
      getUrlFromGroup(scopes) ||
      getUrlFromGroup(abstractShapes) ||
      getUrlFromGroup(brushes) ||
      getUrlFromGroup(hearts) ||
      getUrlFromGroup(discountBadges) ||
      getUrlFromGroup(priceTags) ||
      getUrlFromGroup(gifs) ||
      getUrlFromGroup(gifArrows) ||
      getUrlFromGroup(stickers)

  if (url) {
    element.style.backgroundImage = `url(${url})`
  }

  emit('add-element', element)
}




const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      emit('add-element', {
        id: Date.now(),
        type: 'uploaded-image',
        content: '',
        x: 100,
        y: 100,
        width: 150,
        height: 150,
        rotation: 0,
        opacity: 100,
        style: {
          position: 'absolute',
          backgroundImage: `url(${e.target.result})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'move',
          userSelect: 'none'
        }
      })
    }
    reader.readAsDataURL(file)
  }
}
const addPhoto = (url) => {
  emit('add-element', {
    id: Date.now(),
    type: 'photo',
    content: '',
    x: 100,
    y: 100,
    width: 150,
    height: 150,
    rotation: 0,
    opacity: 100,
    style: {
      position: 'absolute',
      backgroundImage: `url(${url})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundColor: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'move',
      userSelect: 'none'
    }
  })
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
  

  selectedElement.value.style = {
    ...selectedElement.value.style,
    fontFamily,
    fontSize
  }
  selectedElement.value.class = className


  emit('update-element', { ...selectedElement.value })
}

const handleCanvasResize = (dimensions) => {
  emit('resize-canvas', dimensions)
}
const tabIconMap = {
  'Элементы': 'elements',
  'Текст': 'text',
  'stickers': 'stikers',
  'instagram': 'dounloads',
  'upload': 'dounloads',
  'Фон': 'background',
  'AI фото': 'ai',
  'Фото': 'foto',
  'Размеры': 'size'
}


</script>

<template>
  <div class="elements-panel">
    <div class="tabs">
      <button 
        v-for="tab in ['Элементы', 'Текст', 'stickers', 'upload', 'Фон', 'AI фото', 'Фото', 'Размеры']"
        :key="tab"
        :class="['tab-btn', { active: activeTab === tab }]"
        @click="activeTab = tab"
      >
      <img :src="`/icons/${tabIconMap[tab]}.svg`" :alt="tab" class="tab-icon">

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

           <img src="/icons/plus.svg" alt="upload">
            <span>Загрузить изображение</span>
          </label>
        </div>
      </div>

      <div v-if="activeTab === 'Фон'">
        <Background @set-background="(url) => emit('set-background', url)" />
      </div>

      <div v-if="activeTab === 'Фото'">
        <div v-if="activeTab === 'Фото'" class="photos-section">
          <h2>
            Фото
          </h2>
          <input type="text" placeholder="Поиск" class="search" />
          <div class="elements-grid">
            <button
                v-for="(photo, index) in photos"
                :key="'photo-' + index"
                class="element-btn photo-btn"
                @click="addPhoto(photo)"
            >
              <img :src="photo" :alt="'Photo ' + (index + 1)" class="sticker-preview">
            </button>
          </div>
        </div>

      </div>

      <div v-if="activeTab === 'AI фото'">
       <AI/>
      </div>

      <div v-if="activeTab === 'Размеры'" class="resize-section">
        <CanvasResize 
          :initial-width="620"
          :initial-height="520"
          @resize="handleCanvasResize"
        />
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
  margin: 1rem 0;
  gap: 15px;
}

.tab-btn {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 70px;
  height: 70px;
  border-radius: 10px;
  background: #F3F3F3;
  border: none;
  cursor: pointer;
  font-size: 10px;
  padding: 5px;
  word-break: break-word;
  line-height: 1.2;

  img {
    width: 24px;
    height: 24px;
  }
}

.tab-btn.active {
  background: #F37021;
  color: white;

  img {
    filter: brightness(0) invert(1);
  }
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
  background: #F3F3F3;
  border-radius: 4px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}
.upload-area:hover {
  background: #D9D9D9;
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
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  color: #162A47;
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

.resize-section {
  height: 100%;
  overflow-y: auto;
}
h2 {
  font-family: Proxima Nova,sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 100%;
  color: #162A47;
  padding-bottom: 5px;
}
.photos-section {
  padding: 10px;
}
.search {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  height: 50px;
  top: 2475px;
  left: 7858px;
  border-radius: 10px;

}
</style>