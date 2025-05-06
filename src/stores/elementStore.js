import { defineStore } from 'pinia'

export const useElementStore = defineStore('elements', {
  state: () => ({
    selectedElement: null,
    elements: [],
    textStyles: {
      color: '#000000',
      backgroundColor: 'transparent',
      lineHeight: 1.5,
      letterSpacing: 0
    }
  }),

  actions: {
    setSelectedElement(element) {
      this.selectedElement = element
      if (element?.type === 'text') {
        this.textStyles = {
          color: element.style?.color || '#000000',
          backgroundColor: element.style?.backgroundColor || 'transparent',
          lineHeight: parseFloat(element.style?.lineHeight) || 1.5,
          letterSpacing: parseFloat(element.style?.letterSpacing) || 0
        }
      }
    },

    updateElement(updatedElement) {
      const index = this.elements.findIndex(el => el.id === updatedElement.id)
      if (index !== -1) {
        const existingElement = this.elements[index]
        
        if (updatedElement.type === 'text') {
          this.elements[index] = {
            ...existingElement,
            ...updatedElement,
            style: {
              ...existingElement.style,
              ...updatedElement.style,
              color: updatedElement.style?.color || '#000000',
              backgroundColor: updatedElement.style?.backgroundColor || 'transparent',
              fontFamily: updatedElement.style?.fontFamily || 'Arial',
              fontSize: updatedElement.style?.fontSize || '16px',
              lineHeight: updatedElement.style?.lineHeight || 1.5,
              letterSpacing: updatedElement.style?.letterSpacing || 0
            }
          }
        } else if (existingElement.type.startsWith('sticker')) {
          this.elements[index] = {
            ...existingElement,
            ...updatedElement,
            style: {
              ...existingElement.style,
              ...updatedElement.style,
              transform: `scale(${updatedElement.scaleX || 1}, ${updatedElement.scaleY || 1}) rotate(${updatedElement.rotation || 0}deg)`,
              width: updatedElement.width ? `${updatedElement.width}px` : existingElement.style.width,
              height: updatedElement.height ? `${updatedElement.height}px` : existingElement.style.height
            }
          }
        } else {
          this.elements[index] = {
            ...existingElement,
            ...updatedElement,
            style: {
              ...existingElement.style,
              ...updatedElement.style,
              transform: `scale(${updatedElement.scaleX || 1}, ${updatedElement.scaleY || 1}) rotate(${updatedElement.rotation || 0}deg)`
            }
          }
        }

        if (this.selectedElement?.id === updatedElement.id) {
          this.selectedElement = this.elements[index]
        }
      }
    },

    addElement(element) {
      const newElement = {
        id: Date.now(),
        type: element.type || element.id,
        content: element.content || '',
        style: element.style || {},
        x: 50,
        y: 50,
        width: 200,
        height: 200,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 100,
        isNew: true,
        ...element
      }


      if (newElement.type.startsWith('sticker')) {
        newElement.style = {
          ...newElement.style,
          minWidth: '50px',
          minHeight: '50px',
          maxWidth: '400px',
          maxHeight: '400px',
          objectFit: 'contain'
        }
      }

      this.elements.push(newElement)
      this.selectedElement = newElement
    },

    updateTextStyle(style) {
      if (this.selectedElement?.type === 'text') {
        this.textStyles = { ...this.textStyles, ...style }
        this.selectedElement.style = {
          ...this.selectedElement.style,
          ...style
        }
        this.updateElement(this.selectedElement)
      }
    },

    deleteElement(elementId) {
      const index = this.elements.findIndex(el => el.id === elementId)
      if (index !== -1) {
        this.elements.splice(index, 1)
        if (this.selectedElement?.id === elementId) {
          this.selectedElement = null
        }
      }
    }
  }
}) 