<script setup>
import BaseButton from "@/components/common/BaseButton.vue";


</script>

<template>
  <header class='header-wrap'>
    <div>
      <img src="/public/svgs/logo.svg" width="46px" height="36px" alt="logo" />
    </div>
    <BaseButton variant="gray" size="sm" @click="$emit('download-pdf')">Скачать</BaseButton>
    <BaseButton>Сохранить изменения</BaseButton>
  </header>
</template>

<style scoped>
.header-wrap{
  display: flex;
  gap: 15px;
  padding: 12px 27px;
  border-bottom: 1px solid #EFEFEF;

}
</style>
