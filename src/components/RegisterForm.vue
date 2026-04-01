<template>
  <div class="container">
    <div class="form-box">
      <h1>Register</h1>

      <div v-if="error" class="error-msg">{{ error }}</div>

      <form @submit.prevent="handleRegister">
        <input v-model="name" type="text" placeholder="Full Name" required />
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <input v-model="passwordConfirm" type="password" placeholder="Confirm Password" required />
        <button type="submit" :disabled="loading">{{ loading ? 'Creating...' : 'Register' }}</button>
      </form>

      <p>Already have account? <RouterLink to="/login">Login</RouterLink></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { register, error, loading } from '@/services/AuthService';

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');

const handleRegister = async () => {
  if (password.value !== passwordConfirm.value) {
    alert('Passwords do not match');
    return;
  }

  try {
    await register(name.value, email.value, password.value, passwordConfirm.value);
    router.push('/');
  } catch (err) {
    console.log(err);
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.form-box {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 350px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.error-msg {
  background: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

button {
  padding: 10px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background: #5568d3;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

p {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
}

a {
  color: #667eea;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
