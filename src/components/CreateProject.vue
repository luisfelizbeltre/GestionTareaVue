<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-20">
        <div class="card shadow-lg">
          <div class="card-header bg-primary text-white text-center">
            <h2>{{ props.project ? "Actualizar Proyecto" : "Crear Proyecto" }}</h2>
          </div>
          <div class="card-body">
            <form @submit.prevent="createOrUpdateProject" class="needs-validation">
              <div class="mb-3">
                <label for="name" class="form-label">Nombre del Proyecto</label>
                <input type="text" v-model="name" id="name" placeholder="Nombre del Proyecto" class="form-control" required />
              </div>

              <div class="mb-3">
                <label for="description" class="form-label">Descripción</label>
                <input type="text" v-model="description" id="description" placeholder="Descripción" class="form-control" required />
              </div>

            
              <div class="form-group mb-3" >
                <label for="responsibleUsername" class="form-label">Responsable</label>
            <select v-model="responsibleUsername" id="assignedTo" required>
              <option v-for="user in users" :key="user.id" :value="user.username">{{ user.username }}</option>
            </select>
          </div>

              <div class="mb-3">
                <label for="endDate" class="form-label">Fecha de Fin</label>
                <input type="date" v-model="endDate" id="endDate" class="form-control" required />
              </div>

              <div class="mb-3">
                <label for="endTime" class="form-label">Hora de Fin</label>
                <input type="time" v-model="endTime" id="endTime" class="form-control" required />
              </div>

              <div class="text-center">
                <button type="submit" class="btn btn-success w-100"> {{ props.project ? "Actualizar Proyecto" : "Crear Proyecto" }} </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref,onMounted ,defineProps} from 'vue';
import projectService from '../services/projectService';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import userService from '@/services/userService';
import { defineEmits } from 'vue';
const emit = defineEmits(['inFocus', 'close'])
const props = defineProps({
  project:{
    type:Object,
    default:null,
  },
});// Asegúrate de que dayjs esté instalado.

const name = ref(props.project?.name || "");
const description = ref(props.project?.description || "");
const responsibleUsername = ref(props.project?.responsibleUsername || "");
const endDate = ref(props.project?.endDate?.split("T")[0] || ""); // Si viene una fecha completa, extraemos solo la fecha.
const endTime = ref(props.project?.endDate?.split("T")[1] || "");
const endDateTime = ref('');

const createOrUpdateProject = async () => {
  try {
    // Validar que se seleccionaron fecha y hora
    if (endDate.value && endTime.value) {
      endDateTime.value = dayjs(`${endDate.value}T${endTime.value}`).format(
        "YYYY-MM-DDTHH:mm:ss"
      );
    } else {
      await Swal.fire("Error", "Por favor selecciona una fecha y una hora.", "error");
      return;
    }

    const projectData = {
      name: name.value,
      description: description.value,
      responsibleUsername: responsibleUsername.value,
      endDate: endDateTime.value,
    };

    let response;
    if (props.project && props.project.id) {
      // Si el proyecto tiene un `id`, es una edición
      response = await projectService.updateProject(props.project.id, projectData);
      if (response && response.data) {
        await Swal.fire("Éxito", "El proyecto ha sido actualizado.", "success");
        emit('close');
      } else {
        throw new Error("Respuesta no válida al actualizar el proyecto.");
      }
    } else {
      // Si no hay datos en `props.project`,  es creación
      response = await projectService.createProject(projectData);
      if (response && response.data) {
        await Swal.fire("Éxito", "El proyecto ha sido creado.", "success");
        emit('close');
      } else {
        throw new Error("Respuesta no válida al crear el proyecto.");
      }
    }
  } catch (error) {
    console.error("Error al guardar el proyecto:", error);
    await Swal.fire("Error", "No se pudo guardar el proyecto. Inténtalo nuevamente.", "error");
  }
};


const users = ref([]);
  
  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      console.log(response.data)
      users.value = response.data.filter(user =>{
       return user.roles && !user.roles.includes("ROLE_USER")
      })
    } catch (error) {
      console.error("There was an error fetching the users:", error);
    }
  };
  
  onMounted(fetchUsers)
</script>

<style scoped>
.card {
  border-radius: 8px;
}
.card-header {
  font-size: 24px;
  font-weight: 500;
}

select{
  width: 100%;
  
}
label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
</style>
