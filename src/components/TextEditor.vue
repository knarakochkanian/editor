<template>
  <div class="text-editor">
    <div class="tabs">
      <button
          :class="{ active: currentTab === 'text' }"
          @click="currentTab = 'text'"
      >
        Текст
      </button>
      <button
          :class="{ active: currentTab === 'fonts' }"
          @click="currentTab = 'fonts'"
      >
        Мои шрифты
      </button>
    </div>

    <div v-if="currentTab === 'text'" class="switch-group">
      <label>Тип заголовка:</label>
      <div class="switcher">
        <button
            v-for="heading in headingLevels"
            :key="heading.label"
            :class="{ active: selectedHeading === heading.label }"
            @click="selectedHeading = heading.label"
        >
          {{ heading.label }}
        </button>
      </div>
    </div>

    <div v-if="currentTab === 'fonts'" class="switch-group">
      <label>Шрифт:</label>
      <div class="switcher">
        <button
            v-for="font in fontFamilies"
            :key="font"
            :style="{ fontFamily: font }"
            :class="{ active: selectedFont === font }"
            @click="selectedFont = font"
        >
          {{ font }}
        </button>
      </div>
    </div>

    <button class="create-btn" @click="emitTextBlock">Добавить текст</button>
  </div>
</template>



<script setup>
import {ref, watch} from 'vue'

const props = defineProps({
  modelValue: Object
})
const emit = defineEmits(['update-text-style', 'create-text-block', 'update:modelValue'])

const fontFamilies = [
  'Arial', 'Roboto', 'Georgia', 'Times New Roman', 'Verdana',
  'Courier New', 'Tahoma', 'Trebuchet MS', 'Helvetica', 'Comic Sans MS'
]

const headingLevels = [
  {label: 'H1', fontSize: '32px'},
  {label: 'H2', fontSize: '24px'},
  {label: 'H3', fontSize: '19px'}
]
const currentTab = ref('text')

const selectedFont = ref(fontFamilies[0])
const selectedHeading = ref(headingLevels[0].label)

const emitTextBlock = () => {
  const heading = headingLevels.find(h => h.label === selectedHeading.value)
  emit('create-text-block', {
    fontFamily: selectedFont.value,
    fontSize: heading?.fontSize || '24px',
    className: `heading-${selectedHeading.value.toLowerCase()}`
  })
}

watch(
    () => props.modelValue,
    (newVal) => {
      if (!newVal) return
      selectedFont.value = newVal.style?.fontFamily || fontFamilies[0]

      const found = headingLevels.find(h =>
          newVal.class?.includes(`heading-${h.label.toLowerCase()}`)
      )
      selectedHeading.value = found?.label || headingLevels[0].label
    },
    {immediate: true}
)

watch([selectedFont, selectedHeading], () => {
  const heading = headingLevels.find(h => h.label === selectedHeading.value)
  emit('update-text-style', {
    fontFamily: selectedFont.value,
    fontSize: heading?.fontSize || '24px',
    className: `heading-${selectedHeading.value.toLowerCase()}`
  })
})
</script>

<style scoped>
.text-editor {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.switch-group label {
  font-weight: bold;
  margin-bottom: 0.2rem;
  display: block;
  color: #162A47;
}

.switcher {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.switcher button {
  padding: 0.4rem 0.8rem;
  border: 1px solid #ccc;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.switcher button.active {
  background-color: #F37021;
  color: white;
  border-color: #F37021;
}

.create-btn {
  background-color: #2196F3;
  color: white;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.tabs button {
  padding: 0.5rem 1rem;
  background-color: #f1f1f1;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}
.tabs button:first-child{
  border-radius: 10px 0 0 10px;
}
.tabs button:nth-child(2){
  border-radius: 0 10px 10px 0;
}
.tabs button.active {
  background-color: #F37021;
  color: white;
}


</style>
