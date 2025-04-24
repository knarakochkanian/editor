<template>
  <button
      class="base-button"
      :class="[
      `button--${variant}`,
      `button--${size}`,
      { 'button--disabled': disabled }
    ]"
      :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'orange',
  },
  size: {
    type: String,
    default: 'md',
  },
  disabled: Boolean,
})
</script>

<style scoped>
.base-button {
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: Proxima Nova,serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 100%;
  text-align: center;
}

.button--sm {
  padding: 4px 12px;
  font-size: 0.875rem;
}
.button--md {
  padding: 8px 16px;
  font-size: 1rem;
}
.button--lg {
  padding: 12px 24px;
  font-size: 1.125rem;
}

.button--orange {
  background-color: #F37021;
  color: white;
}
.button--orange:hover {
  filter: brightness(1.1);
}
.button--orange:active {
  filter: brightness(0.9);
}

.button--gray {
  background-color: #EAEAEA;
  color: black;
}
.button--gray:hover {
  filter: brightness(1.05);
}
.button--gray:active {
  filter: brightness(0.95);
}

.button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
