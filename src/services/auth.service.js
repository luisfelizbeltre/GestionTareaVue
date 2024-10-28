import api from './api';

class AuthService {
  login(user) {
    return api.post('/auth/signin', {
      username: user.username,
      password: user.password
    }
    ).then(response => {
      if (response.data.accessToken) {
        sessionStorage.setItem('user', JSON.stringify(response.data));
        console.log(response.data)

      }
      return response.data;
    }).catch(
      e => {
        if (e.response) {
          throw new Error("Usuario o contraseña incorrecto");
        } else {
          throw new Error("Problema de conexión. Intenta más tarde");


        }

      }
    );
  }

  logout() {
    sessionStorage.removeItem('user');
  }

  register(user) {
    return api.post('/auth/signup', {
      tenantName: user.value.tenantName,
      username: user.value.username,
      email: user.value.email,
      password: user.value.password,
      role: [user.value.role],
      projectName: user.value.projectName
    });
  }

  registerTenant(user) {
    return api.post('/auth/registerCompany', {
      tenantName: user.tenantName,
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role
    });
  }
  
  registerUser(user) {
    return api.post('/auth/registerUserToCompany', {
      tenantName: user.tenantName,
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role
    });
  }

  getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('user'));
  }
}

export default new AuthService();
