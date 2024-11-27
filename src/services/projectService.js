import api from './api';

class ProjectService {
  createProject(project) {
    return api.post('/projects/create', project);
  }
updateProject(projectId,project){
  return api.put(`/projects/update/${projectId}`, project);
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
  deleteProject(projectId){

    return api.delete(`/projects/${projectId}`)
  }

  getAllMembers(projectId){
    return api.get(`/projects/${projectId}/members`)
  }

  deleteMember(projectId,memberId){
    return api.delete(`/projects/${projectId}/members/${memberId}`)
  }
}

export default new ProjectService();
