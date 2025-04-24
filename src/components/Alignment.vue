<script setup>

const emit = defineEmits(['align'])

const alignmentOptions = [
  { id: 'top-left', icon: '/svgs/align/left.svg', label: 'Top Left' },
  { id: 'top-center', icon: '/svgs/align/top.svg', label: 'Top' },
  { id: 'top-right', icon: '/svgs/align/left.svg', label: 'Top Right' },
  { id: 'middle-right', icon: '/svgs/align/middle.svg', label: 'Center' },
  { id: 'bottom-center', icon: '/svgs/align/bottom.svg', label: 'Bottom' },
  { id: 'middle-center', icon: '/svgs/align/center.svg', label: 'center' },
]


const handleAlignment = (option) => {
  emit('align', option.id)
}
</script>

<template>
  <div class="alignment-controls">
    <div class="alignment-grid">
      <button
        v-for="option in alignmentOptions"
        :key="option.id"
        class="alignment-btn"
        @click="handleAlignment(option)"
        :title="option.label"
      >
     <img :src="option.icon" alt="align"/>
      </button>
    </div>
  </div>
</template>

<style scoped>
.alignment-controls {
  padding: 1rem;
}

.alignment-controls h4 {
  margin-bottom: 1rem;
  color: #333;
}

.alignment-grid {
  display: flex;
  justify-content: space-between;
}

.alignment-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
  border: unset;
}

.alignment-btn:hover {
  background-color: #f0f0f0;
  border-color: #d0d0d0;
}

.alignment-btn img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}
</style> 