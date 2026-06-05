<template>
  <div>
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3">
        <span class="material-symbols-outlined">pets</span>
        Loading room details...
      </p>
    </div>

    <div v-else-if="room" class="room-detail">
      <section class="room-hero">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <h1 class="display-3 fw-bold mb-3">{{ room.name }}</h1>
              <div class="price-badge">
                <span class="material-symbols-outlined">attach_money</span>
                {{ room.price_per_night }} / night
              </div>
              <p class="lead mt-3">{{ room.description }}</p>
              <button @click="goToBooking" class="btn btn-success btn-lg mt-3">
                <span class="material-symbols-outlined">calendar_today</span>
                Book This Suite
              </button>
            </div>
            <div class="col-lg-6 mt-4 mt-lg-0">
              <img :src="room.image_url || getRandomCatImage(room.id)" 
                   class="img-fluid rounded-4 shadow"
                   :alt="room.name">
            </div>
          </div>
        </div>
      </section>

      <section class="details-section">
        <div class="container">
          <div class="row g-4">
            <div class="col-md-6">
              <div class="info-card">
                <h3>
                  <span class="material-symbols-outlined">checklist</span>
                  Suite Features
                </h3>
                <div class="features-list">
                  <div v-for="feature in getFeatures(room.features)" 
                       :key="feature" 
                       class="feature-item">
                    <span class="material-symbols-outlined">check_circle</span>
                    {{ feature }}
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="info-card">
                <h3>
                  <span class="material-symbols-outlined">info</span>
                  Specifications
                </h3>
                <div class="specs-list">
                  <div class="spec-item">
                    <span class="material-symbols-outlined">pets</span>
                    <span>Maximum cats: <strong>{{ room.max_cats }}</strong></span>
                  </div>
                  <div class="spec-item">
                    <span class="material-symbols-outlined">straighten</span>
                    <span>Room size: <strong>8 m²</strong></span>
                  </div>
                  <div class="spec-item">
                    <span class="material-symbols-outlined">bed</span>
                    <span>Bedding: <strong>Premium orthopedic bed</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="cta-section">
        <div class="container text-center">
          <h2>Ready to Book {{ room.name }}?</h2>
          <p class="lead">Give your cat the luxury experience they deserve.</p>
          <button @click="goToBooking" class="btn btn-light btn-lg">
            <span class="material-symbols-outlined">calendar_today</span>
            Book Now
          </button>
        </div>
      </section>
    </div>

    <div v-else class="text-center py-5">
      <span class="material-symbols-outlined no-results-icon">sentiment_dissatisfied</span>
      <h3>Room Not Found</h3>
      <p>The suite you're looking for doesn't exist.</p>
      <router-link to="/rooms" class="btn btn-success">
        <span class="material-symbols-outlined">arrow_back</span>
        Back to Suites
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'RoomDetail',
  data() {
    return {
      room: null,
      loading: true
    }
  },
  async mounted() {
    await this.fetchRoom()
  },
  methods: {
    async fetchRoom() {
      const roomId = this.$route.params.id
      try {
        const response = await axios.get(`http://localhost:5000/api/rooms/${roomId}`)
        this.room = response.data
      } catch (error) {
        console.error('Error fetching room:', error)
        this.room = null
      } finally {
        this.loading = false
      }
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
        'https://picsum.photos/id/20/600/400',
        'https://picsum.photos/id/21/600/400',
        'https://picsum.photos/id/22/600/400'
      ]
      return catImages[(id - 1) % catImages.length]
    },
    goToBooking() {
      // Pass the room_type_id (this.room.id) to the booking page
      this.$router.push(`/booking/${this.room.id}`)
    }
  }
}
</script>

<style scoped>
.room-hero {
  background: linear-gradient(135deg, #1a5f3a 0%, #2d8c4e 100%);
  color: white;
  padding: 60px 0;
}

.price-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 20px;
  border-radius: 30px;
  font-size: 1.25rem;
  font-weight: 500;
  margin: 15px 0;
}

.details-section {
  padding: 60px 0;
  background: #f8f9fa;
}

.info-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  height: 100%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.info-card h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.features-list, .specs-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item, .spec-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.feature-item .material-symbols-outlined,
.spec-item .material-symbols-outlined {
  color: #2d8c4e;
}

.cta-section {
  background: linear-gradient(135deg, #2d8c4e 0%, #1a5f3a 100%);
  color: white;
  padding: 60px 0;
}

.btn-success, .btn-light {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 30px;
  font-size: 1.1rem;
}

.btn-light {
  background: white;
  color: #2d8c4e;
}

.btn-light:hover {
  transform: translateY(-2px);
  background: white;
  color: #1a5f3a;
}

.no-results-icon {
  font-size: 64px;
  color: #2d8c4e;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .room-hero {
    padding: 40px 0;
    text-align: center;
  }
  .details-section {
    padding: 40px 0;
  }
  .room-hero h1 {
    font-size: 1.8rem;
  }
}
</style>