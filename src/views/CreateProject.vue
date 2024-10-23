<template>
  <div class="create-project-container">
    <h2>Create Project</h2>
    <form @submit.prevent="createProject" class="project-form">
      <input v-model="name" placeholder="Project Name" class="input-field" />
      <input v-model="description" placeholder="Description" class="input-field" />
      
    
      <input v-model="responsibleUsername" placeholder="Responsible Username" class="input-field" />
       <!-- Input para seleccionar la hora de fin -->
    <!-- Input para seleccionar la fecha de fin -->
    <label for="endDate">Fecha de fin:</label>
    <input type="date" v-model="endDate" class="input-field" placeholder="Fecha de fin" />

    <!-- Input para seleccionar la hora de fin -->
    <label for="endTime">Hora de fin:</label>
    <input type="time" v-model="endTime" class="input-field" placeholder="Hora de fin" />


      <button type="submit" class="submit-button">Create Project</button>
    </form>
  </div>
</template>



  <script setup>
  import { ref } from 'vue';
  import projectService from '../services/projectService';
import dayjs from 'dayjs';
  //import { useRouter } from 'vue-router';
  const name = ref('');
  const description = ref('');
  const responsibleUsername = ref('');
  const endDate=ref("")
  const endTime=ref("")
  const endDateTime=ref("");
 // const router = useRouter();
  const createProject = async () => {
if (endDate.value && endTime.value) {
  endDateTime.value = dayjs(`${endDate.value}T${endTime.value}`).format('YYYY-MM-DDTHH:mm:ss')
  alert('Fecha y Hora combinadas:', endDateTime.value);
} else {
  alert("seleciona una fecha y una hora")
  return
  
}

    const project = {
      name: name.value,
      description: description.value,
      responsibleUsername: responsibleUsername.value,
      endDate:endDateTime.value
    };
    try {
      await projectService.createProject(project);
      alert('Project created successfully');
      location.reload()
      //router.push("/dashboard")
    } catch (error) {
      console.error(error);
      alert('Error creating project');
    }
  };
  </script>
  
<style scoped>
.create-project-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.project-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-field {
  padding: 12px;
  font-size: 18px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s;
}

.input-field:focus {
  border-color: #007BFF;
}

.submit-button {
  padding: 12px;
  font-size: 18px;
  color: #fff;
  background-color: #007BFF;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #0056b3;
}
</style>