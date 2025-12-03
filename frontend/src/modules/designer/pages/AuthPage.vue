<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1 class="auth-title">{{ isLogin ? 'Login' : 'Register' }}</h1>
      
      <form @submit.prevent="handleSubmit" class="auth-form">
        <div v-if="!isLogin" class="form-group">
          <label for="name">Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            placeholder="Your name"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="your@email.com"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            placeholder="••••••••"
            :minlength="6"
          />
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>

        <button type="submit" class="submit-button" :disabled="isLoading">
          {{ isLoading ? 'Please wait...' : (isLogin ? 'Login' : 'Register') }}
        </button>
      </form>

      <div class="auth-toggle">
        <button @click="toggleMode" class="toggle-button">
          {{ isLogin ? 'Need an account? Register' : 'Have an account? Login' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useDesignerStore } from '../stores/designer.store';

const router = useRouter();
const store = useDesignerStore();

const isLogin = ref(true);
const isLoading = ref(false);
const error = ref('');

const form = reactive({
  name: '',
  email: '',
  password: '',
});

function toggleMode() {
  isLogin.value = !isLogin.value;
  error.value = '';
}

async function handleSubmit() {
  isLoading.value = true;
  error.value = '';

  try {
    let success = false;
    
    if (isLogin.value) {
      success = await store.login(form.email, form.password);
    } else {
      success = await store.register(form.name, form.email, form.password);
    }

    if (success) {
      router.push('/projects');
    } else {
      error.value = store.error || 'Authentication failed';
    }
  } catch (e: any) {
    error.value = e.message || 'An error occurred';
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.auth-title {
  color: #333;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 30px;
  text-align: center;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #555;
  font-size: 14px;
  font-weight: 500;
}

.form-group input {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.error-message {
  color: #e53e3e;
  background: #fed7d7;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
}

.submit-button {
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-toggle {
  margin-top: 20px;
  text-align: center;
}

.toggle-button {
  background: none;
  border: none;
  color: #667eea;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
}

.toggle-button:hover {
  color: #764ba2;
}
</style>
