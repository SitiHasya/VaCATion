<template>
  <footer class="bg-dark text-white py-4 mt-5">
    <div class="container">
      <div class="row">
        <div class="col-md-4 text-center text-md-start mb-3 mb-md-0">
          <h5>
            <span class="material-symbols-outlined">pets</span>
            VaCATion
          </h5>
          <p class="footer-text">Luxury cat boarding for discerning felines</p>
        </div>
        <div class="col-md-4 text-center mb-3 mb-md-0">
          <h6>Quick Links</h6>
          <router-link to="/rooms" class="footer-link">Rooms</router-link>
          <router-link to="/my-bookings" class="footer-link">Bookings</router-link>
          <router-link to="/contact" class="footer-link">Contact</router-link>
        </div>
        <div class="col-md-4 text-center text-md-end">
          <h6>Contact</h6>
          <p class="footer-text mb-0">📞 (555) 123-VCAT</p>
          <p class="footer-text">✉️ hello@vacation.com</p>
        </div>
      </div>
      <hr class="my-3">
      <div class="text-center footer-copyright">
        © 2026 VaCATion - All rights reserved. Your cat deserves a vacation too!
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
footer {
  background: #1a1a1a !important;
}

footer h5 {
  font-size: 1.3rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

footer h6 {
  font-size: 1.1rem;
  margin-bottom: 12px;
  font-weight: 600;
}

footer .footer-text {
  font-size: 1rem;
  margin-bottom: 8px;
  color: #cccccc;
}

.footer-link {
  display: block;
  color: #aaaaaa;
  text-decoration: none;
  font-size: 1rem;
  margin-bottom: 8px;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #38ef7d;
}

.footer-copyright {
  font-size: 0.9rem;
  color: #888888;
}

hr {
  border-color: rgba(255, 255, 255, 0.1);
}

.material-symbols-outlined {
  font-size: 22px;
  vertical-align: middle;
}

@media (max-width: 768px) {
  footer h5 {
    justify-content: center;
  }
  
  footer .footer-text {
    font-size: 0.95rem;
  }
  
  .footer-link {
    font-size: 0.95rem;
  }
}
</style>