import { apiCall } from './api';

export async function getDashboardData() {
  return await apiCall('GET', '/dashboard');
}
