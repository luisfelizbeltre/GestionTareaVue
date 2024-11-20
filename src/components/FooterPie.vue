<template>
    <footer>
      <div class="redes-sociales">
        <a href="https://www.facebook.com" target="_blank" class="icono-facebook" aria-label="Facebook"></a>
        <a href="https://twitter.com" target="_blank" class="icono-twitter" aria-label="Twitter"></a>
        <a href="https://www.linkedin.com" target="_blank" class="icono-linkedin" aria-label="LinkedIn"></a>
      </div>
      <small>&copy; Copyright 2020. All rights reserved.</small>
    </footer>
  </template>
  
  <style scoped>
 
footer {
  position: relative;
  bottom: 0;
  left: 0;
  background-color: rgba(139, 136, 136, 0.097);
  color: rgb(0, 0, 0);
  padding: 2rem 0;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  width: 100%;
}
  
  .redes-sociales {
    display: flex;
    justify-content: center;
    gap: 1rem; /* Espacio entre los iconos */
  }
  
  .redes-sociales a {
    display: inline-block;
    width: 40px;
    height: 40px;
    background-size: cover;
    background-position: center;
    border-radius: 50%;
    transition: transform 0.3s ease;
  }
  
  .redes-sociales .icono-facebook {
    background-image: url('@/assets/facebook.png');
  }
  
  .redes-sociales .icono-twitter {
    background-image: url('@/assets/twitter.png');
  }
  
  .redes-sociales .icono-linkedin {
    background-image: url('@/assets/linkedin.png');
  }
  
  .redes-sociales a:hover {
    transform: scale(1.1); /* Efecto de hover */
  }
  
  small {
    font-size: 0.875rem;
    color: #000000;
    margin-top: 1rem;
    display: block;
  }
  </style>
  