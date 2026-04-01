<template>
  <div class="navbar">
    <h1>FrontCin Hall</h1>
    <div>
      <span v-if="user">{{ user.name }}</span>
      <button @click="handleLogout">Logout</button>
    </div>
  </div>

  <div class="dashboard">
    <h2 v-if="user">Welcome, {{ user.name }}!</h2>
    <p v-if="user">Email: {{ user.email }}</p>
    <p>This is your dashboard</p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { user, logout } from '@/services/AuthService';

const router = useRouter();

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
}

.navbar h1 {
  margin: 0;
}

.navbar button {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid white;
  border-radius: 4px;
  cursor: pointer;
}

.navbar button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.dashboard {
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
}

.dashboard h2 {
  color: #333;
}

.dashboard p {
  color: #666;
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
