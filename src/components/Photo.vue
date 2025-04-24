<script setup>
const emit = defineEmits(['set-background'])

const backgrounds = [
  'public/backgrounds/foto1.jpeg',
  'public/backgrounds/foto2.jpeg',
  'public/backgrounds/foto3.jpeg',
  'public/backgrounds/foto4.jpeg'
]

const selectBackground = (url) => {
  emit('set-background', url)
}
</script>

<template>
  <div class="background-picker">
    <h2>
      Фото
    </h2>
    <input type="text" placeholder="Поиск" class="search" />
    <div class="grid">
      <div
          v-for="bg in backgrounds"
          :key="bg"
          class="bg-thumb"
          @click="selectBackground(bg)"
          :style="{ backgroundImage: `url(${bg})` }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
h2 {
  font-family: Proxima Nova,sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 100%;
  color: #162A47;
  padding-bottom: 5px;
}
.background-picker {
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
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.bg-thumb {
  width: 100%;
  padding-top: 75%;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  cursor: pointer;
}
</style>
