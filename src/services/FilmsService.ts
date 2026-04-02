import { apiCall } from './api';

export async function getFilms() {
  return await apiCall('GET', '/films');
}

export async function getFilm(id) {
  return await apiCall('GET', `/films/${id}`);
}

export async function createFilm(filmData) {
  return await apiCall('POST', '/films', filmData);
}

export async function updateFilm(id, filmData) {
  return await apiCall('PUT', `/films/${id}`, filmData);
}

export async function deleteFilm(id) {
  return await apiCall('DELETE', `/films/${id}`);
}
