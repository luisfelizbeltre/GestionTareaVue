<template>
    <div class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <slot></slot> 
        <button @click="closeModal" class="close-button">Cerrar</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits} from 'vue';
  
  // Prop para controlar si el modal está visible
  defineProps(['show']);
  
  // Evento para notificar al componente padre que se cerró el modal
  

// Define el evento que el modal puede emitir
const emit = defineEmits(['close']);

// Método para cerrar el modal
  
  // Método para cerrar el modal
  const closeModal = () => {
    emit('close');
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    max-width: 90%;
    width: 400px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    text-align: center;
  }
  
  .close-button {
    margin-top: 15px;
    padding: 8px 16px;
    background: #007acc;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .close-button:hover {
    background: #005f99;
  }
  </style>
  