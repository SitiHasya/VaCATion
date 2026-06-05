<template>
  <div>
    <!-- Page Header -->
    <section class="page-header">
      <div class="container">
        <h1 class="display-4 fw-bold mb-3">
          <span class="material-symbols-outlined">king_bed</span>
          Our Cat Suites
        </h1>
        <p class="lead">Luxury accommodations designed specifically for feline comfort and happiness.</p>
      </div>
    </section>

    <!-- Filters Section -->
    <section class="filters-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6">
            <p class="mb-0">
              <span class="material-symbols-outlined">hotel</span>
              Showing {{ filteredRooms.length }} of {{ rooms.length }} suites
            </p>
          </div>
          <div class="col-md-6">
            <div class="d-flex gap-2 justify-content-md-end">
              <select v-model="sortBy" class="form-select w-auto">
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
              <select v-model="priceFilter" class="form-select w-auto">
                <option value="all">All Prices</option>
                <option value="under50">Under $50</option>
                <option value="50to100">$50 - $100</option>
                <option value="over100">Over $100</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Rooms Grid -->
    <section class="rooms-section">
      <div class="container">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-success" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">
            <span class="material-symbols-outlined">pets</span>
            Loading our luxurious suites...
          </p>
        </div>

        <!-- No Results -->
        <div v-else-if="filteredRooms.length === 0" class="text-center py-5">
          <span class="material-symbols-outlined no-results-icon">sentiment_dissatisfied</span>
          <h3>No suites found</h3>
          <p>Try adjusting your filters to see more options.</p>
          <button @click="resetFilters" class="btn btn-success">
            <span class="material-symbols-outlined">refresh</span>
            Reset Filters
          </button>
        </div>

        <!-- Rooms Grid -->
        <div v-else class="row g-4">
          <div v-for="room in filteredRooms" :key="room.id" class="col-md-6 col-lg-4">
            <div class="room-card card h-100">
              <div class="card-img-wrapper">
                <img :src="room.image_url || getRandomCatImage(room.id)" 
                     class="card-img-top" 
                     :alt="room.name"
                     loading="lazy">
                <div class="card-badge">
                  <span class="badge bg-success">
                    <span class="material-symbols-outlined">attach_money</span>
                    {{ room.price_per_night }}/night
                  </span>
                </div>
              </div>
              <div class="card-body">
                <h5 class="card-title">{{ room.name }}</h5>
                <p class="card-text text-muted small">{{ truncate(room.description, 120) }}</p>
                
                <!-- Features -->
                <div class="room-features mt-3 mb-3">
                  <span v-for="feature in getFeatures(room.features)" 
                        :key="feature" 
                        class="feature-badge">
                    <span class="material-symbols-outlined">check_circle</span>
                    {{ feature }}
                  </span>
                </div>

                <!-- Specs -->
                <div class="room-specs d-flex justify-content-between mb-3">
                  <div class="spec">
                    <span class="material-symbols-outlined">pets</span>
                    <span>Up to {{ room.max_cats }} cats</span>
                  </div>
                  <div class="spec">
                    <span class="material-symbols-outlined">straighten</span>
                    <span>{{ room.size_sqm || 8 }} m²</span>
                  </div>
                </div>

                <router-link :to="`/room/${room.id}`" class="btn btn-outline-success w-100">
                  <span class="material-symbols-outlined">visibility</span>
                  View Suite
                  <span class="material-symbols-outlined">arrow_forward</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Rooms',
  data() {
    return {
      rooms: [],
      loading: true,
      sortBy: 'price_asc',
      priceFilter: 'all'
    }
  },
  computed: {
    filteredRooms() {
      let result = [...this.rooms]
      
      // Apply price filter
      if (this.priceFilter !== 'all') {
        result = result.filter(room => {
          const price = parseFloat(room.price_per_night)
          if (this.priceFilter === 'under50') return price < 50
          if (this.priceFilter === '50to100') return price >= 50 && price <= 100
          if (this.priceFilter === 'over100') return price > 100
          return true
        })
      }
      
      // Apply sorting
      if (this.sortBy === 'price_asc') {
        result.sort((a, b) => parseFloat(a.price_per_night) - parseFloat(b.price_per_night))
      } else if (this.sortBy === 'price_desc') {
        result.sort((a, b) => parseFloat(b.price_per_night) - parseFloat(a.price_per_night))
      } else if (this.sortBy === 'name_asc') {
        result.sort((a, b) => a.name.localeCompare(b.name))
      }
      
      return result
    }
  },
  async mounted() {
    await this.fetchRooms()
  },
  methods: {
    async fetchRooms() {
      try {
        const response = await axios.get('http://localhost:5000/api/rooms')
        this.rooms = response.data
      } catch (error) {
        console.error('Error fetching rooms:', error)
        // Fallback demo data without emojis
        this.rooms = [
          {
            id: 1,
            name: 'Cozy Cat Nap',
            description: 'Perfect for shy cats who love quiet spaces. Includes soft bedding, a hiding box, and window view.',
            price_per_night: 45,
            max_cats: 1,
            features: '["soft bedding", "hiding box", "window view"]',
            image_url: 'https://picsum.photos/id/20/400/300'
          },
          {
            id: 2,
            name: 'Purr Palace',
            description: 'Our most popular room! Features a scratching post, climbing shelf, webcam access, and premium bedding.',
            price_per_night: 75,
            max_cats: 2,
            features: '["scratching post", "climbing shelf", "webcam", "premium bedding"]',
            image_url: 'https://picsum.photos/id/21/400/300'
          },
          {
            id: 3,
            name: 'Meow Mansion',
            description: 'The ultimate luxury suite. Private outdoor catio, heated bed, , and daily gourmet treats.',
            price_per_night: 120,
            max_cats: 3,
            features: '["private catio", "heated bed",  "webcam", "daily treats"]',
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
    getFeatures(features) {
      if (!features) return []
      if (typeof features === 'string') {
        try {
          return JSON.parse(features)
        } catch {
          return features.split(',')
        }
      }
      return features
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
    },
    resetFilters() {
      this.sortBy = 'price_asc'
      this.priceFilter = 'all'
    }
  }
}
</script>

<style scoped>
/* Page Header */
.page-header {
  background: linear-gradient(135deg, #1a5f3a 0%, #2d8c4e 100%);
  color: white;
  padding: 60px 0;
  text-align: center;
}

.page-header .material-symbols-outlined {
  font-size: 48px;
  vertical-align: middle;
  font-variation-settings: 'FILL' 1;
}

/* Filters Section */
.filters-section {
  padding: 20px 0;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.filters-section .material-symbols-outlined {
  font-size: 18px;
  vertical-align: middle;
  color: #2d8c4e;
}

.form-select {
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 8px 30px 8px 12px;
}

/* Rooms Section */
.rooms-section {
  padding: 60px 0;
}

.room-card {
  border-radius: 20px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  border: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.room-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

.card-img-wrapper {
  position: relative;
  overflow: hidden;
}

.card-img-top {
  height: 240px;
  width: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.room-card:hover .card-img-top {
  transform: scale(1.05);
}

.card-badge {
  position: absolute;
  top: 15px;
  right: 15px;
}

.card-badge .badge {
  font-size: 1rem;
  padding: 8px 12px;
  border-radius: 25px;
  background: #2d8c4e;
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-badge .badge .material-symbols-outlined {
  font-size: 16px;
}

.card-body {
  padding: 1.5rem;
}

.card-title {
  font-size: 1.35rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.feature-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #f0fdf4;
  color: #166534;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  margin: 0 4px 8px 0;
}

.feature-badge .material-symbols-outlined {
  font-size: 14px;
}

.room-specs {
  padding: 12px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.spec {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
  font-size: 0.85rem;
}

.spec .material-symbols-outlined {
  font-size: 18px;
  color: #2d8c4e;
}

.btn-outline-success {
  border-radius: 30px;
  padding: 10px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-outline-success:hover {
  background: #2d8c4e;
  border-color: #2d8c4e;
}

.btn-outline-success .material-symbols-outlined {
  font-size: 18px;
}

.btn-success {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-success .material-symbols-outlined {
  font-size: 18px;
}

.no-results-icon {
  font-size: 64px;
  color: #2d8c4e;
  margin-bottom: 20px;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    padding: 40px 0;
  }
  
  .page-header h1 {
    font-size: 1.8rem;
  }
  
  .page-header .material-symbols-outlined {
    font-size: 36px;
  }
  
  .rooms-section {
    padding: 40px 0;
  }
  
  .card-img-top {
    height: 200px;
  }
  
  .filters-section .row {
    gap: 15px;
  }
  
  .filters-section .d-flex {
    justify-content: flex-start !important;
    margin-top: 10px;
  }
  
  .feature-badge {
    font-size: 0.7rem;
    padding: 3px 8px;
  }
}

@media (max-width: 480px) {
  .card-title {
    font-size: 1.1rem;
  }
  
  .room-specs {
    flex-direction: column;
    gap: 8px;
  }
  
  .card-badge .badge {
    font-size: 0.85rem;
    padding: 5px 10px;
  }
}
</style>