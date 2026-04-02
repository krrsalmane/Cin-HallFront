<template>
  <div class="navbar">
    <h1>FrontCin Hall</h1>
    <nav class="nav-menu">
      <RouterLink to="/" :class="{ active: $route.path === '/' }">Dashboard</RouterLink>
      <RouterLink to="/films" :class="{ active: $route.path === '/films' }">Films</RouterLink>
    </nav>
    <div>
      <button v-if="isAdmin" @click="showForm = true" class="btn-add">+ Add Film</button>
      <button @click="handleLogout">Logout</button>
    </div>
  </div>

  <div class="container">
    <!-- Film Form (Create/Edit) -->
    <div v-if="showForm" class="modal-overlay" @click="showForm = false">
      <div class="modal" @click.stop>
        <FilmForm
          :film="selectedFilm"
          @submit="handleSubmit"
          @cancel="showForm = false"
        />
      </div>
    </div>

    <!-- Error & Loading -->
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="loading" class="loading">Loading films...</div>

    <!-- Films Grid -->
    <div v-if="!loading && films.length > 0" class="films-grid">
      <div v-for="film in films" :key="film.id" class="film-card">
        <div class="film-header">
          <h3>{{ film.title }}</h3>
          <div v-if="isAdmin" class="film-actions">
            <button @click="editFilm(film)" class="btn-edit">Edit</button>
            <button @click="deleteFilmHandler(film.id)" class="btn-delete">Delete</button>
          </div>
        </div>
        <p class="film-genre">{{ film.genre }}</p>
        <p v-if="film.description" class="film-description">{{ film.description }}</p>
        <div class="film-meta">
          <span>Duration: {{ film.duration_minutes }} min</span>
          <span>Age: {{ film.minimum_age }}+</span>
        </div>
        <p v-if="film.actors" class="film-actors">{{ film.actors }}</p>
        <a v-if="film.trailer_url" :href="film.trailer_url" target="_blank" class="trailer-link">
          Watch Trailer
        </a>
      </div>
    </div>

    <div v-else-if="!loading" class="no-films">
      No films found. <span v-if="isAdmin">Click "Add Film" to create one!</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { user, logout } from '@/services/AuthService';
import { getFilms, createFilm, updateFilm, deleteFilm } from '@/services/FilmsService';
import FilmForm from '@/components/FilmForm.vue';

const router = useRouter();
const films = ref([]);
const loading = ref(true);
const error = ref('');
const showForm = ref(false);
const selectedFilm = ref(null);

const isAdmin = computed(() => user.value?.is_admin);

onMounted(async () => {
  try {
    films.value = await getFilms();
  } catch (err) {
    error.value = 'Failed to load films';
    console.log(err);
  } finally {
    loading.value = false;
  }
});

const editFilm = (film) => {
  selectedFilm.value = film;
  showForm.value = true;
};

const handleSubmit = async (filmData) => {
  try {
    if (selectedFilm.value) {
      await updateFilm(selectedFilm.value.id, filmData);
      films.value = await getFilms();
    } else {
      await createFilm(filmData);
      films.value = await getFilms();
    }
    showForm.value = false;
    selectedFilm.value = null;
    error.value = '';
  } catch (err) {
    error.value = 'Failed to save film';
    console.log(err);
  }
};

const deleteFilmHandler = async (id) => {
  if (confirm('Are you sure you want to delete this film?')) {
    try {
      await deleteFilm(id);
      films.value = await getFilms();
    } catch (err) {
      error.value = 'Failed to delete film';
      console.log(err);
    }
  }
};

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
  margin-left: 10px;
}

.navbar button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.btn-add {
  background: #4CAF50 !important;
  border: none !important;
  font-weight: bold;
}

.btn-add:hover {
  background: #45a049 !important;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
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
}

.films-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.film-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.film-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.film-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 10px;
}

.film-header h3 {
  margin: 0;
  color: #333;
  flex: 1;
}

.film-actions {
  display: flex;
  gap: 5px;
}

.btn-edit,
.btn-delete {
  padding: 4px 8px;
  font-size: 12px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.btn-edit {
  background: #667eea;
  color: white;
}

.btn-edit:hover {
  background: #5568d3;
}

.btn-delete {
  background: #ff6b6b;
  color: white;
}

.btn-delete:hover {
  background: #ee5a52;
}

.film-genre {
  color: #667eea;
  font-weight: bold;
  margin: 5px 0;
  font-size: 14px;
}

.film-description {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin: 10px 0;
}

.film-meta {
  display: flex;
  gap: 15px;
  font-size: 13px;
  color: #999;
  margin: 10px 0;
}

.film-actors {
  font-size: 13px;
  color: #666;
  margin: 10px 0;
}

.trailer-link {
  display: inline-block;
  margin-top: 10px;
  color: #667eea;
  text-decoration: none;
  font-weight: bold;
  font-size: 14px;
}

.trailer-link:hover {
  text-decoration: underline;
}

.no-films {
  text-align: center;
  color: #999;
  padding: 40px;
  background: #f9f9f9;
  border-radius: 8px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}
</style>
