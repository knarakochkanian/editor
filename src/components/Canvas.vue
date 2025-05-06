<template>
  <div class="pixta-workspace__canvas">
    <div class="canvas-container" data-fabric="wrapper">
      <canvas ref="canvas" class="upper-canvas" data-fabric="top"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import 'fabric'
const fabric = window.fabric
import { useElementStore } from '@/stores/elementStore'

const props = defineProps({
  backgroundImage: {
    type: String,
    default: null
  },
  canvasSize: {
    type: Object,
    default: () => ({
      width: 620,
      height: 520
    })
  }
})

const store = useElementStore()
const canvas = ref(null)
let fabricCanvas = null


watch(() => props.backgroundImage, (newImage) => {
  if (fabricCanvas && newImage) {
    fabric.Image.fromURL(newImage, (img) => {
      img.set({
        width: fabricCanvas.width,
        height: fabricCanvas.height,
        originX: 'left',
        originY: 'top',
        selectable: false,
        evented: false
      })
      fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas))
    })
  }
})

onMounted(() => {

  fabricCanvas = new fabric.Canvas(canvas.value, {
    width: props.canvasSize.width,
    height: props.canvasSize.height,
    selection: true,
    preserveObjectStacking: true
  })


  canvas.value.style.width = props.canvasSize.width + 'px'
  canvas.value.style.height = props.canvasSize.height + 'px'


  fabric.Object.prototype.set({
    borderColor: '#2196F3',
    cornerColor: '#2196F3',
    cornerSize: 12,
    cornerStyle: 'circle',
    transparentCorners: false,
    hasRotatingPoint: true,
    hasControls: true,
    cornerStrokeColor: '#FFFFFF',
    padding: 5,
    borderScaleFactor: 2
  })


  fabric.Object.prototype.setControlsVisibility({
    mt: true, // middle top
    mb: true, // middle bottom
    ml: true, // middle left
    mr: true, // middle right
    tl: true, // top left
    tr: true, // top right
    bl: true, // bottom left
    br: true  // bottom right
  })


  fabricCanvas.setBackgroundColor('#ffffff', () => {
    fabricCanvas.renderAll()
  })


  fabricCanvas.on('object:modified', handleObjectModified)
  fabricCanvas.on('object:selected', handleObjectSelected)
  fabricCanvas.on('selection:cleared', handleSelectionCleared)
  fabricCanvas.on('object:scaling', handleScaling)
  fabricCanvas.on('object:scaled', handleScaled)
})


const handleScaling = (e) => {
  const object = e.target
  if (object.type === 'textbox' || object.type === 'text') {
    const newFontSize = Math.round(object.fontSize * object.scaleX)
    object.set({
      fontSize: newFontSize,
      scaleX: 1,
      scaleY: 1
    })
  } else if (object.type === 'image') {
  
    const width = object.width * object.scaleX
    const height = object.height * object.scaleY
    

    if (store.selectedElement) {
      store.updateElement({
        ...store.selectedElement,
        width,
        height,
        scaleX: object.scaleX,
        scaleY: object.scaleY
      })
    }
  }
    fabricCanvas.renderAll()
  }


const handleScaled = (e) => {
  const object = e.target

  if (store.selectedElement) {
    const updatedElement = {
      ...store.selectedElement,
      width: Math.round(object.getScaledWidth()),
      height: Math.round(object.getScaledHeight()),
      scaleX: object.scaleX,
      scaleY: object.scaleY
    }
    store.updateElement(updatedElement)
  }
}


const handleObjectModified = (e) => {
  const object = e.target
  if (store.selectedElement) {
    const updatedElement = {
      ...store.selectedElement,
      width: Math.round(object.getScaledWidth()),
      height: Math.round(object.getScaledHeight()),
    x: Math.round(object.left),
    y: Math.round(object.top),
    rotation: object.angle || 0,
      scaleX: object.scaleX,
      scaleY: object.scaleY
  }
    store.updateElement(updatedElement)
  }
}


const handleObjectSelected = (e) => {
  const object = e.target
  if (object) {
    store.setSelectedElement({
      id: object.id,
      type: object.type,
      x: Math.round(object.left),
      y: Math.round(object.top),
      width: Math.round(object.getScaledWidth()),
      height: Math.round(object.getScaledHeight()),
      rotation: object.angle || 0,
      scaleX: object.scaleX,
      scaleY: object.scaleY
    })
  }
}


const handleSelectionCleared = () => {
  store.setSelectedElement(null)
}

const addElement = (element) => {

  if (!fabricCanvas) {
    console.error('Canvas not initialized')
    return
  }

  let fabricObject

  if (element.type === 'text') {
    fabricObject = new fabric.Textbox(element.content || 'Введите текст', {
      left: element.x || 100,
      top: element.y || 100,
      width: element.width || 200,
      fontSize: element.style?.fontSize || 24,
      fontFamily: element.style?.fontFamily || 'Arial',
      fill: element.style?.color || '#FF69B4',
      backgroundColor: 'white',
      textAlign: 'center',
      padding: 15,
      cornerRadius: 15,
      hasControls: true,
      borderColor: '#FF8C69',
      strokeWidth: 2,
      stroke: '#FF8C69'
    })
  } else if (element.type === 'image' || element.type.startsWith('sticker')) {

    const url = element.url
    console.log('Loading image from URL:', url) 
    
    fabric.Image.fromURL(url, (img) => {
      console.log('Image loaded:', img)
      
      if (!img) {
        console.error('Failed to load image')
        return
      }

      img.set({
        left: element.x || 100,
        top: element.y || 100,
        scaleX: element.scaleX || 1,
        scaleY: element.scaleY || 1,
        hasControls: true,
        cornerColor: '#2196F3',
        cornerSize: 12,
        cornerStyle: 'circle',
        transparentCorners: false,
        padding: 5,
        borderColor: '#2196F3',
        cornerStrokeColor: '#FFFFFF'
      })
      
    
      if (element.type.startsWith('sticker')) {
        const maxSize = 200
        const width = img.width
        const height = img.height
        const scale = Math.min(maxSize / width, maxSize / height)
        img.scale(scale)
      }
      
      img.id = element.id
      fabricCanvas.add(img)
      fabricCanvas.setActiveObject(img)
      fabricCanvas.renderAll()
      console.log('Image added to canvas') 
    }, null, {
      crossOrigin: 'anonymous' 
    })
    return
  } else {
    fabricObject = new fabric.Rect({
      left: element.x || 100,
      top: element.y || 100,
      width: element.width || 200,
      height: element.height || 100,
      fill: element.style?.backgroundColor || 'white',
      stroke: '#FF8C69',
      strokeWidth: 2,
      rx: 15,
      ry: 15,
      hasControls: true
    })
  }

  if (fabricObject) {
    fabricObject.id = element.id
    fabricCanvas.add(fabricObject)
    fabricCanvas.setActiveObject(fabricObject)
    fabricCanvas.renderAll()
    console.log('Object added to canvas:', fabricObject)
  }
}


defineExpose({
  addElement
})
</script>

<style scoped>
.pixta-workspace__canvas {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.canvas-container {
  width: 620px;
  height: 520px;
  position: relative;
  user-select: none;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.upper-canvas {
  position: absolute;
  left: 0;
  top: 0;
  touch-action: manipulation;
  user-select: none;
}
</style> 