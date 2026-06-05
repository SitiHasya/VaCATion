<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
    <div class="container-fluid">
      <router-link class="navbar-brand fw-bold" to="/">
        <span class="material-symbols-outlined">pets</span>
        VaCATion
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/rooms">Rooms</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/contact">Contact</router-link>
          </li>
          <li v-if="isLoggedIn" class="nav-item">
            <router-link class="nav-link" to="/my-bookings">My Bookings</router-link>
          </li>
          <li v-if="isLoggedIn" class="nav-item">
            <router-link class="nav-link" to="/my-cats">My Cats</router-link>
          </li>
          <li v-if="!isLoggedIn" class="nav-item">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
          <li v-if="!isLoggedIn" class="nav-item">
            <router-link class="nav-link" to="/register">Register</router-link>
          </li>
          <li v-if="isLoggedIn" class="nav-item">
            <button @click="handleLogout" class="btn btn-outline-light logout-btn">
              <span class="material-symbols-outlined">logout</span>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('token')
    }
  },
  methods: {
    handleLogout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
/* Bigger navbar */
.navbar {
  padding: 16px 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

/* Bigger container */
.container-fluid {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Bigger brand logo */
.navbar-brand {
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}

.navbar-brand .material-symbols-outlined {
  font-size: 32px;
}

/* Bigger nav links */
.nav-link {
  font-size: 1.1rem;
  font-weight: 500;
  padding: 10px 18px !important;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #38ef7d !important;
}

.router-link-active {
  color: #38ef7d !important;
  font-weight: 600;
}

/* Bigger logout button */
.logout-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  font-size: 1rem;
  font-weight: 500;
  margin-left: 10px;
  border-radius: 25px;
}

.logout-btn .material-symbols-outlined {
  font-size: 18px;
}

/* Mobile responsive */
@media (max-width: 992px) {
  .navbar {
    padding: 12px 0;
  }
  
  .navbar-brand {
    font-size: 1.5rem;
  }
  
  .navbar-brand .material-symbols-outlined {
    font-size: 28px;
  }
  
  .nav-link {
    font-size: 1rem;
    padding: 8px 0 !important;
  }
  
  .logout-btn {
    margin-left: 0;
    margin-top: 10px;
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .container-fluid {
    padding: 0 16px;
  }
  
  .navbar-brand {
    font-size: 1.3rem;
  }
}
</style>