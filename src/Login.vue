<template>
  <div class="auth-container">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="auth-card">
            <div class="text-center mb-4">
              <span class="material-symbols-outlined auth-icon">pets</span>
              <h2 class="mt-2">Welcome Back</h2>
              <p class="text-muted">Login to manage your cat's vacation</p>
            </div>

            <form @submit.prevent="handleLogin">
              <!-- Email -->
              <div class="mb-3">
                <label class="form-label">
                  <span class="material-symbols-outlined">email</span>
                  Email Address
                </label>
                <input 
                  type="email" 
                  class="form-control" 
                  v-model="form.email"
                  :class="{ 'is-invalid': errors.email }"
                  placeholder="catlover@example.com"
                  required>
                <div class="invalid-feedback">{{ errors.email }}</div>
              </div>

              <!-- Password -->
              <div class="mb-3">
                <label class="form-label">
                  <span class="material-symbols-outlined">lock</span>
                  Password
                </label>
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  class="form-control" 
                  v-model="form.password"
                  :class="{ 'is-invalid': errors.password }"
                  placeholder="••••••••"
                  required>
                <div class="invalid-feedback">{{ errors.password }}</div>
                <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                  <span class="material-symbols-outlined">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>

              <!-- Submit Button -->
              <button type="submit" class="btn btn-success w-100" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                <span class="material-symbols-outlined">login</span>
                {{ loading ? 'Logging in...' : 'Login' }}
              </button>
            </form>

            <div class="text-center mt-4">
              <p class="mb-0">
                Don't have an account? 
                <router-link to="/register" class="text-success">Create one</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      errors: {},
      loading: false,
      showPassword: false
    }
  },
  methods: {
    async handleLogin() {
      this.errors = {}
      this.loading = true
      
      try {
        const response = await axios.post('http://localhost:5000/api/login', this.form)
        
        // Save token and user to localStorage
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        // Redirect to home page
        this.$router.push('/')
        
      } catch (error) {
        if (error.response && error.response.data) {
          this.errors.general = error.response.data.error
        } else {
          this.errors.general = 'Login failed. Please try again.'
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  padding: 40px 0;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
}

.auth-card {
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.auth-icon {
  font-size: 48px;
  color: #2d8c4e;
}

.auth-card h2 {
  font-weight: 600;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  margin-bottom: 8px;
}

.form-label .material-symbols-outlined {
  font-size: 18px;
  color: #2d8c4e;
}

.form-control {
  border-radius: 12px;
  border: 1px solid #ddd;
  padding: 12px 15px;
}

.form-control:focus {
  border-color: #2d8c4e;
  box-shadow: 0 0 0 0.2rem rgba(45, 140, 78, 0.25);
}

.password-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
}

.btn-success {
  background: #2d8c4e;
  border: none;
  border-radius: 12px;
  padding: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-success .material-symbols-outlined {
  font-size: 18px;
}

.btn-success:hover {
  background: #1a5f3a;
}

.text-success {
  color: #2d8c4e !important;
  text-decoration: none;
}

.text-success:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .auth-card {
    padding: 25px;
    margin: 0 15px;
  }
  
  .auth-icon {
    font-size: 36px;
  }
}
</style>