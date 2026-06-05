<template>
  <div>
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 hero-content">
            <h1 class="display-3 fw-bold mb-3">
              <span class="material-symbols-outlined cat-paw">pets</span>
              Luxury Boarding <br>For Your Cat
            </h1>
            <p class="lead mb-4">
              VaCATion offers premium cat boarding with spacious suites, 
              personalized care, and daily photo updates. Because your cat deserves a vacation too.
            </p>
            <div class="hero-buttons">
              <router-link to="/rooms" class="btn btn-light btn-lg me-3">
                View Rooms <span class="material-symbols-outlined">arrow_forward</span>
              </router-link>
              <router-link to="/register" class="btn btn-outline-light btn-lg">
                Book Now <span class="material-symbols-outlined">calendar_today</span>
              </router-link>
            </div>
          </div>
          <div class="col-lg-6 d-none d-lg-block text-center">
            <div class="floating-cat">
              <span class="material-symbols-outlined cat-emoji">pets</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <h2 class="text-center section-title">Why Choose VaCATion?</h2>
        <div class="row g-4">
          <div class="col-md-4">
            <div class="feature-card text-center">
              <div class="feature-icon">
                <span class="material-symbols-outlined">king_bed</span>
              </div>
              <h4>Private Suites</h4>
              <p class="text-muted">Individual rooms with comfortable bedding, scratching posts, and window perches.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-card text-center">
              <div class="feature-icon">
                <span class="material-symbols-outlined">photo_camera</span>
              </div>
              <h4>Daily Photo Updates</h4>
              <p class="text-muted">Get photos of your cat sent to your phone every day via email.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-card text-center">
              <div class="feature-icon">
                <span class="material-symbols-outlined">medical_services</span>
              </div>
              <h4>Vet on Call</h4>
              <p class="text-muted">24/7 veterinary support for peace of mind while you're away.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Rooms Section -->
    <section class="rooms-section">
      <div class="container">
        <h2 class="text-center section-title">Featured Suites</h2>
        
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-success" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2">Loading our luxurious suites...</p>
        </div>

        <!-- Rooms Grid -->
        <div v-else class="row g-4">
          <div v-for="room in featuredRooms" :key="room.id" class="col-md-6 col-lg-4">
            <div class="room-card card h-100">
              <img :src="room.image_url || getRandomCatImage(room.id)" 
                   class="card-img-top" 
                   :alt="room.name"
                   loading="lazy">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h5 class="card-title mb-0">{{ room.name }}</h5>
                  <span class="badge bg-success">${{ room.price_per_night }}/night</span>
                </div>
                <p class="card-text text-muted small">{{ truncate(room.description, 100) }}</p>
                <div class="room-features mt-2 mb-3">
                  <span v-for="feature in getFirstTwoFeatures(room.features)" 
                        :key="feature" 
                        class="badge bg-light text-dark me-1">
                    {{ feature }}
                  </span>
                </div>
                <router-link :to="`/room/${room.id}`" class="btn btn-outline-success w-100">
                  View Suite <span class="material-symbols-outlined">arrow_forward</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-4">
          <router-link to="/rooms" class="btn btn-success btn-lg">
            View All Suites <span class="material-symbols-outlined">arrow_forward</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="row text-center">
          <div class="col-md-3 col-6 mb-3 mb-md-0">
            <div class="stat-number">500+</div>
            <div class="stat-label">
              <span class="material-symbols-outlined">pets</span> Happy Cats
            </div>
          </div>
          <div class="col-md-3 col-6 mb-3 mb-md-0">
            <div class="stat-number">1000+</div>
            <div class="stat-label">
              <span class="material-symbols-outlined">bed</span> Nights Booked
            </div>
          </div>
          <div class="col-md-3 col-6 mb-3 mb-md-0">
            <div class="stat-number">98%</div>
            <div class="stat-label">
              <span class="material-symbols-outlined">thumb_up</span> Satisfaction
            </div>
          </div>
          <div class="col-md-3 col-6">
            <div class="stat-number">24/7</div>
            <div class="stat-label">
              <span class="material-symbols-outlined">support_agent</span> Care
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonial Section -->
    <section class="testimonial-section">
      <div class="container">
        <div class="testimonial-card text-center">
          <div class="quote-icon">
            <span class="material-symbols-outlined">format_quote</span>
          </div>
          <p class="testimonial-text">
            My two cats stayed at VaCATion for a week while I was on holiday. 
            They were so happy and relaxed when I picked them up! 
            The daily photo updates really helped me relax during my trip.
          </p>
          <div class="testimonial-author">
            <strong>- Sarah M.</strong>
            <div class="stars">★★★★★</div>
            <small class="text-muted">Cat parent of Whiskers & Mittens</small>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container text-center">
        <h2 class="mb-3">Ready to Book Your Cat's Vacation?</h2>
        <p class="lead mb-4">Give your feline friend the luxury experience they deserve.</p>
        <router-link to="/register" class="btn btn-light btn-lg">
          Get Started Today <span class="material-symbols-outlined">arrow_forward</span>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',
  data() {
    return {
      featuredRooms: [],
      loading: true
    }
  },
  async mounted() {
    await this.fetchFeaturedRooms()
  },
  methods: {
    async fetchFeaturedRooms() {
      try {
        const response = await axios.get('http://localhost:5000/api/rooms/featured')
        this.featuredRooms = response.data
      } catch (error) {
        console.log('Backend not ready, using demo data')
        this.featuredRooms = [
          {
            id: 1,
            name: '😴 Cozy Cat Nap',
            description: 'Perfect for shy cats who love quiet spaces. Includes soft bedding, a hiding box, and window view.',
            price_per_night: 45,
            features: ['soft bedding', 'hiding box', 'window view'],
            image_url: 'https://picsum.photos/id/20/400/300'
          },
          {
            id: 2,
            name: '👑 Purr Palace',
            description: 'Our most popular room! Features a scratching post, climbing shelf, webcam access, and premium bedding.',
            price_per_night: 75,
            features: ['scratching post', 'climbing shelf', 'webcam', 'premium bedding'],
            image_url: 'https://picsum.photos/id/21/400/300'
          },
          {
            id: 3,
            name: '💎 Meow Mansion',
            description: 'The ultimate luxury suite. Private outdoor catio, heated bed, water fountain, and daily gourmet treats.',
            price_per_night: 120,
            features: ['private catio', 'heated bed', 'water fountain', 'webcam', 'daily treats'],
            image_url: 'https://picsum.photos/id/22/400/300'
          }
        ]
      } finally {
        this.loading = false
      }
    },
    truncate(text, length) {
      if (!text) return ''
      return text.length > length ? text.substring(0, length) + '...' : text
    },
   getFirstTwoFeatures(features) {
  if (!features) return []
  // Parse if it's a JSON string
  let featuresArray = features
  if (typeof features === 'string') {
    try {
      featuresArray = JSON.parse(features)
    } catch {
      featuresArray = features.split(',')
    }
  }
  if (!featuresArray || !featuresArray.length) return []
  return featuresArray.slice(0, 2)
},
    getRandomCatImage(id) {
      const catImages = [
        'https://picsum.photos/id/20/400/300',
        'https://picsum.photos/id/21/400/300', 
        'https://picsum.photos/id/22/400/300',
        'https://picsum.photos/id/23/400/300',
        'https://picsum.photos/id/24/400/300'
      ]
      return catImages[(id - 1) % catImages.length]
    }
  }
}
</script>

<style scoped>
/* Google Material Icons styling */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  vertical-align: middle;
}

.cat-emoji {
  font-size: 200px;
  font-variation-settings: 'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 48;
}

.cat-paw {
  font-size: 48px;
  margin-right: 10px;
}

.btn .material-symbols-outlined {
  font-size: 18px;
  margin-left: 5px;
}

.stat-label .material-symbols-outlined {
  font-size: 16px;
  margin-right: 5px;
  vertical-align: middle;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #1a5f3a 0%, #2d8c4e 100%);
  padding: 80px 0;
  color: white;
}

.hero-content {
  animation: fadeInUp 0.8s ease-out;
}

.cat-emoji {
  font-size: 200px;
  animation: float 3s ease-in-out infinite;
  display: inline-block;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Section Titles */
.section-title {
  font-size: 2.5rem;
  margin-bottom: 3rem;
  position: relative;
  display: inline-block;
  width: auto;
}

.section-title:after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: #2d8c4e;
}

/* Features Section */
.features-section {
  padding: 80px 0;
  background: #f8f9fa;
}

.feature-card {
  background: white;
  border-radius: 20px;
  padding: 30px 20px;
  transition: transform 0.3s, box-shadow 0.3s;
  height: 100%;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.feature-icon span {
  font-size: 48px;
  color: #2d8c4e;
}

/* Rooms Section */
.rooms-section {
  padding: 80px 0;
}

.room-card {
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid #e0e0e0;
}

.room-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.card-img-top {
  height: 220px;
  object-fit: cover;
}

.room-features {
  min-height: 40px;
}

/* Stats Section */
.stats-section {
  background: linear-gradient(135deg, #1a5f3a 0%, #2d8c4e 100%);
  color: white;
  padding: 60px 0;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.9;
}

/* Testimonial Section */
.testimonial-section {
  padding: 80px 0;
  background: #f8f9fa;
}

.testimonial-card {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 30px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.quote-icon span {
  font-size: 60px;
  color: #2d8c4e;
}

.testimonial-text {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #333;
  margin: 20px 0;
}

.stars {
  color: #ffc107;
  font-size: 1.2rem;
  margin-top: 5px;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #2d8c4e 0%, #1a5f3a 100%);
  color: white;
  padding: 80px 0;
}

/* Buttons */
.btn-light {
  background: white;
  color: #2d8c4e;
  border: none;
  transition: transform 0.2s;
}

.btn-light:hover {
  transform: translateY(-2px);
  background: white;
  color: #1a5f3a;
}

.btn-outline-light {
  border: 2px solid white;
  color: white;
}

.btn-outline-light:hover {
  background: white;
  color: #2d8c4e;
}

.btn-success {
  background: #2d8c4e;
  border: none;
}

.btn-success:hover {
  background: #1a5f3a;
}

.btn-success .material-symbols-outlined,
.btn-light .material-symbols-outlined,
.btn-outline-light .material-symbols-outlined {
  font-size: 18px;
  vertical-align: middle;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-section {
    padding: 50px 0;
    text-align: center;
  }
  
  .cat-emoji {
    font-size: 120px;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .feature-card {
    padding: 20px;
  }
  
  .card-img-top {
    height: 180px;
  }
  
  .testimonial-card {
    padding: 20px;
    margin: 0 15px;
  }
  
  .testimonial-text {
    font-size: 1rem;
  }
  
  .stat-number {
    font-size: 1.8rem;
  }
  
  .hero-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .hero-buttons .btn {
    margin: 0 !important;
  }
}

@media (max-width: 480px) {
  .display-3 {
    font-size: 1.8rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .stat-label {
    font-size: 0.8rem;
  }
  
  .cat-paw {
    font-size: 32px;
  }
}
/* Feature Badges - Make them bigger */
.room-features .badge {
  padding: 8px 16px !important;
  font-size: 0.9rem !important;
  font-weight: 500 !important;
  border-radius: 25px !important;
  margin-right: 8px !important;
  margin-bottom: 8px !important;
  background-color: #f0fdf4 !important;
  color: #166534 !important;
}

.room-features .badge .material-symbols-outlined {
  font-size: 16px;
  margin-right: 4px;
}

</style>