import { ref } from 'vue';
import { apiCall, saveToken, removeToken } from './api';

export const user = ref(null);
export const loading = ref(false);
export const error = ref('');

export async function register(name, email, password, passwordConfirm) {
  loading.value = true;
  error.value = '';

  try {
    const result = await apiCall('POST', '/register', {
      name,
      email,
      password,
      password_confirmation: passwordConfirm,
    });

    saveToken(result.token);
    user.value = result.user;
    return result;
  } catch (err) {
    error.value = err.message;
    throw err;
  } finally {
    loading.value = false;
  }
}

export async function login(email, password) {
  loading.value = true;
  error.value = '';

  try {
    const result = await apiCall('POST', '/login', { email, password });
    saveToken(result.token);
    user.value = result.user || result.data;
    return result;
  } catch (err) {
    error.value = err.message;
    throw err;
  } finally {
    loading.value = false;
  }
}

export async function logout() {
  try {
    await apiCall('POST', '/logout');
  } catch (err) {
    console.log('Logout error:', err);
  } finally {
    removeToken();
    user.value = null;
  }
}

export function isLoggedIn() {
  return !!localStorage.getItem('token');
}
