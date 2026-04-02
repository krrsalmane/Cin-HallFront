<template>
  <div class="navbar">
    <h1>FrontCin Hall</h1>
    <nav class="nav-menu">
      <RouterLink to="/" :class="{ active: $route.path === '/' }">Dashboard</RouterLink>
      <RouterLink to="/films" :class="{ active: $route.path === '/films' }">Films</RouterLink>
    </nav>
    <div>
      <span v-if="user">{{ user.name }}</span>
      <button @click="handleLogout">Logout</button>
    </div>
  </div>

  <div class="dashboard">
    <h2>Welcome, {{ user?.name }}!</h2>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="loading" class="loading">Loading...</div>

    <!-- Stats Cards -->
    <div v-if="!loading && data" class="stats">
      <div class="stat-card">
        <div class="stat-number">{{ data.total_films }}</div>
        <div class="stat-label">Total Films</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ data.total_session }}</div>
        <div class="stat-label">Total Sessions</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ data.total_reservation }}</div>
        <div class="stat-label">Total Reservations</div>
      </div>
    </div>

    <!-- Films Table -->
    <div v-if="!loading && data" class="section">
      <h3>Films Performance</h3>
      <table v-if="data.films.length > 0" class="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Total Tickets</th>
            <th>Total Revenue</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="film in data.films" :key="film.title">
            <td>{{ film.title }}</td>
            <td>{{ film.total_ticket }}</td>
            <td>${{ film.total_revenue }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else>No films data available</p>
    </div>

    <!-- Sessions Table -->
    <div v-if="!loading && data" class="section">
      <h3>Sessions Occupancy</h3>
      <table v-if="data.sessions.length > 0" class="table">
        <thead>
          <tr>
            <th>Session ID</th>
            <th>Capacity</th>
            <th>Reserved Seats</th>
            <th>Occupancy %</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="session in data.sessions" :key="session.session_id">
            <td>#{{ session.session_id }}</td>
            <td>{{ session.capacity }}</td>
            <td>{{ session.reserved_seats }}</td>
            <td>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: session.occupation_percentage + '%' }">
                  {{ session.occupation_percentage }}%
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>No sessions data available</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { user, logout } from '@/services/AuthService';
import { getDashboardData } from '@/services/DashboardService';

const router = useRouter();
const data = ref(null);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    data.value = await getDashboardData();
  } catch (err) {
    error.value = 'Failed to load dashboard data. Make sure you have admin access.';
    console.log(err);
  } finally {
    loading.value = false;
  }
});

const handleLogout = async () => {
  await logout();
  router.push('/login');
};
</script>


<style scoped>
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar h1 {
  margin: 0;
  font-size: 24px;
}

.nav-menu {
  display: flex;
  gap: 20px;
}

.nav-menu a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background 0.3s;
}

.nav-menu a:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-menu a.active {
  background: rgba(255, 255, 255, 0.2);
}

.navbar button {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.navbar button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.dashboard h2 {
  color: #333;
  margin-bottom: 30px;
}

.error {
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.loading {
  text-align: center;
  color: #666;
  padding: 40px;
  font-size: 18px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 10px;
}

.stat-label {
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

.section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.section h3 {
  color: #333;
  margin-top: 0;
  margin-bottom: 20px;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.table th {
  background: #f5f5f5;
  color: #333;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #ddd;
}

.table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
  color: #666;
}

.table tr:hover {
  background: #fafafa;
}

.progress-bar {
  background: #eee;
  border-radius: 4px;
  height: 24px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  transition: width 0.3s ease;
}

.section p {
  color: #999;
  text-align: center;
  padding: 20px;
}
</style>

<style scoped>
.dashboard {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-name {
  font-size: 14px;
}

.btn-logout {
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-logout:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.dashboard-container h2 {
  color: #333;
  margin-bottom: 10px;
}

.dashboard-container p {
  color: #666;
  margin-bottom: 20px;
}

.content-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 30px;
}

.content-section h3 {
  color: #333;
  margin-top: 0;
}

.content-section p {
  color: #666;
}
</style>
