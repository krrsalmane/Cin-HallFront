<template>
  <div class="form-container">
    <h2>{{ film ? 'Edit Film' : 'Create Film' }}</h2>

    <div v-if="error" class="error">{{ error }}</div>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Title *</label>
        <input v-model="formData.title" type="text" placeholder="Film title" required />
      </div>

      <div class="form-group">
        <label>Genre</label>
        <input v-model="formData.genre" type="text" placeholder="e.g., Action, Drama" />
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea v-model="formData.description" placeholder="Film description" rows="3"></textarea>
      </div>

      <div class="form-group">
        <label>Actors</label>
        <input v-model="formData.actors" type="text" placeholder="e.g., Actor 1, Actor 2" />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Duration (minutes) *</label>
          <input v-model.number="formData.duration_minutes" type="number" placeholder="120" required />
        </div>

        <div class="form-group">
          <label>Minimum Age *</label>
          <input v-model.number="formData.minimum_age" type="number" placeholder="13" required />
        </div>
      </div>

      <div class="form-group">
        <label>Trailer URL *</label>
        <input
          v-model="formData.trailer_url"
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          required
        />
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-submit">{{ film ? 'Update' : 'Create' }}</button>
        <button type="button" @click="$emit('cancel')" class="btn-cancel">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  film: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['submit', 'cancel']);

const formData = ref({
  title: '',
  genre: '',
  description: '',
  actors: '',
  duration_minutes: '',
  minimum_age: '',
  trailer_url: '',
});

const error = ref('');

watch(
  () => props.film,
  (newFilm) => {
    if (newFilm) {
      formData.value = { ...newFilm };
    } else {
      formData.value = {
        title: '',
        genre: '',
        description: '',
        actors: '',
        duration_minutes: '',
        minimum_age: '',
        trailer_url: '',
      };
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  error.value = '';

  if (!formData.value.title) {
    error.value = 'Title is required';
    return;
  }
  if (!formData.value.duration_minutes) {
    error.value = 'Duration is required';
    return;
  }
  if (formData.value.minimum_age === '') {
    error.value = 'Minimum age is required';
    return;
  }
  if (!formData.value.trailer_url) {
    error.value = 'Trailer URL is required';
    return;
  }

  emit('submit', formData.value);
};
</script>

<style scoped>
.form-container {
  padding: 30px;
}

.form-container h2 {
  color: #333;
  margin-top: 0;
  margin-bottom: 20px;
}

.error {
  background: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  color: #333;
  font-weight: 500;
  margin-bottom: 5px;
  font-size: 14px;
}

.form-group input,
.form-group textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn-submit,
.btn-cancel {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  flex: 1;
}

.btn-submit {
  background: #667eea;
  color: white;
}

.btn-submit:hover {
  background: #5568d3;
}

.btn-cancel {
  background: #ddd;
  color: #333;
}

.btn-cancel:hover {
  background: #ccc;
}
</style>
