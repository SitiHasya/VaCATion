<template>
  <div class="auth-container">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="auth-card">
            <div class="text-center mb-4">
              <span class="material-symbols-outlined auth-icon">pets</span>
              <h2 class="mt-2">Create Account</h2>
              <p class="text-muted">Join VaCATion and give your cat the best vacation</p>
            </div>

            <form @submit.prevent="handleRegister">
              <!-- Name -->
              <div class="mb-3">
                <label class="form-label">
                  <span class="material-symbols-outlined">person</span>
                  Full Name
                </label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="form.name"
                  :class="{ 'is-invalid': errors.name }"
                  placeholder="John Doe"
                  required>
                <div class="invalid-feedback">{{ errors.name }}</div>
              </div>

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

              <!-- Phone (Optional) -->
              <div class="mb-3">
                <label class="form-label">
                  <span class="material-symbols-outlined">phone</span>
                  Phone Number (Optional)
                </label>
                <input 
                  type="tel" 
                  class="form-control" 
                  v-model="form.phone"
                  placeholder="0412 345 678">
              </div>

              <!-- Password -->
              <div class="mb-3">
                <label class="form-label">
                  <span class="material-symbols-outlined">lock</span>
                  Password
                </label>
                <div class="password-wrapper">
                  <input 
                    :type="showPassword ? 'text' : 'password'" 
                    class="form-control" 
                    v-model="form.password"
                    :class="{ 'is-invalid': errors.password }"
                    placeholder="••••••••"
                    required>
                  <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                    <span class="material-symbols-outlined">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                  </button>
                </div>
                <div class="invalid-feedback">{{ errors.password }}</div>
                <small class="text-muted">Password must be at least 6 characters</small>
              </div>

              <!-- Confirm Password -->
              <div class="mb-3">
                <label class="form-label">
                  <span class="material-symbols-outlined">lock</span>
                  Confirm Password
                </label>
                <div class="password-wrapper">
                  <input 
                    :type="showConfirmPassword ? 'text' : 'password'" 
                    class="form-control" 
                    v-model="form.confirmPassword"
                    :class="{ 'is-invalid': errors.confirmPassword }"
                    placeholder="••••••••"
                    required>
                  <button type="button" class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
                    <span class="material-symbols-outlined">{{ showConfirmPassword ? 'visibility_off' : 'visibility' }}</span>
                  </button>
                </div>
                <div class="invalid-feedback">{{ errors.confirmPassword }}</div>
              </div>

              <!-- Submit Button -->
              <button type="submit" class="btn btn-success w-100" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                <span class="material-symbols-outlined">person_add</span>
                {{ loading ? 'Creating account...' : 'Register' }}
              </button>
            </form>

            <div class="text-center mt-4">
              <p class="mb-0">
                Already have an account? 
                <router-link to="/login" class="text-success">Login here</router-link>
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
  name: 'Register',
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      },
      errors: {},
      loading: false,
      showPassword: false,
      showConfirmPassword: false
    }
  },
  methods: {
    validateForm() {
      this.errors = {}
      
      if (!this.form.name.trim()) {
        this.errors.name = 'Name is required'
      }
      
      if (!this.form.email.trim()) {
        this.errors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(this.form.email)) {
        this.errors.email = 'Please enter a valid email'
      }
      
      if (!this.form.password) {
        this.errors.password = 'Password is required'
      } else if (this.form.password.length < 6) {
        this.errors.password = 'Password must be at least 6 characters'
      }
      
      if (this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = 'Passwords do not match'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    async handleRegister() {
      if (!this.validateForm()) {
        return
      }
      
      this.loading = true
      
      try {
        const response = await axios.post('http://localhost:5000/api/register', {
          name: this.form.name,
          email: this.form.email,
          password: this.form.password,
          phone: this.form.phone
        })
        
        // Save token and user to localStorage
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        // Redirect to home page
        this.$router.push('/')
        
      } catch (error) {
        if (error.response && error.response.data) {
          this.errors.general = error.response.data.error
        } else {
          this.errors.general = 'Registration failed. Please try again.'
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

.password-wrapper {
  position: relative;
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