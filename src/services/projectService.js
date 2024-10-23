import api from './api';

class ProjectService {
  createProject(project) {
    return api.post('/projects/create', project);
  }

  addMemberToProject(projectId, username) {
    return api.post(`/projects/${projectId}/add-member?username=${username}`);
  }
  // projectService.

  getAllProjects(){
    return api.get('/projects/all');
  }
  getProjectById(id){
    return api.get(`/projects/${id}`);
  }
}

export default new ProjectService();
