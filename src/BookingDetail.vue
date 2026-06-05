<template>
  <div class="booking-detail-container">
    <div class="container">
      <div class="back-link">
        <router-link to="/my-bookings" class="btn btn-link">
          <span class="material-symbols-outlined">arrow_back</span>
          Back to My Bookings
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-success"></div>
        <p class="mt-3">Loading booking details...</p>
      </div>

      <div v-else-if="booking" class="booking-detail-card">
        <div class="booking-header" :class="booking.status">
          <div class="status-badge">
            <span class="material-symbols-outlined">
              {{ booking.status === 'confirmed' ? 'check_circle' : 'cancel' }}
            </span>
            {{ booking.status.toUpperCase() }}
          </div>
          <h1>Booking #{{ booking.id }}</h1>
          <p>Booked on {{ formatDate(booking.created_at) }}</p>
        </div>

        <div class="booking-content">
          <div class="row">
            <div class="col-md-6">
              <div class="info-section">
                <h3>
                  <span class="material-symbols-outlined">king_bed</span>
                  Room Details
                </h3>
                <img :src="booking.image_url" :alt="booking.room_name" class="room-image">
                <h4>{{ booking.room_name }}</h4>
                <p class="room-number">Room #{{ booking.room_number }}</p>
                <p class="room-price">${{ booking.price_per_night }} / night</p>
              </div>
            </div>

            <div class="col-md-6">
              <div class="info-section">
                <h3>
                  <span class="material-symbols-outlined">calendar_today</span>
                  Stay Details
                </h3>
                <div class="detail-row">
                  <span class="label">Check-in:</span>
                  <span class="value">{{ formatDate(booking.check_in) }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Check-out:</span>
                  <span class="value">{{ formatDate(booking.check_out) }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Total Nights:</span>
                  <span class="value">{{ booking.total_nights }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Total Amount:</span>
                  <span class="value total">${{ booking.total_amount }}</span>
                </div>
              </div>
            </div>

            <div class="col-12">
              <div class="info-section">
                <h3>
                  <span class="material-symbols-outlined">pets</span>
                  Guest Cats
                </h3>
                <div class="cats-list">
                  <div v-for="cat in booking.cats" :key="cat.id" class="cat-card">
                    <span class="material-symbols-outlined">pets</span>
                    <div>
                      <strong>{{ cat.name }}</strong>
                      <span v-if="cat.breed" class="cat-breed">{{ cat.breed }}</span>
                      <span v-if="cat.age" class="cat-age">{{ cat.age }} years old</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="booking.special_requests" class="col-12">
              <div class="info-section">
                <h3>
                  <span class="material-symbols-outlined">note_add</span>
                  Special Requests
                </h3>
                <p class="special-requests">{{ booking.special_requests }}</p>
              </div>
            </div>

            <div class="col-12" v-if="booking.status === 'confirmed'">
              <div class="cancel-section">
                <button @click="cancelBooking" class="btn btn-danger">
                  <span class="material-symbols-outlined">cancel</span>
                  Cancel Booking
                </button>
                <p class="cancel-note">Free cancellation up to 48 hours before check-in</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <span class="material-symbols-outlined no-results-icon">sentiment_dissatisfied</span>
        <h3>Booking Not Found</h3>
        <p>The booking you're looking for doesn't exist.</p>
        <router-link to="/my-bookings" class="btn btn-success">
          <span class="material-symbols-outlined">arrow_back</span>
          Back to My Bookings
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'BookingDetail',
  data() {
    return {
      booking: null,
      loading: true
    }
  },
  async mounted() {
    await this.fetchBooking()
  },
  methods: {
    getAuthHeaders() {
      const token = localStorage.getItem('token')
      return {
        headers: { Authorization: `Bearer ${token}` }
      }
    },
    async fetchBooking() {
      const bookingId = this.$route.params.id
      try {
        const response = await axios.get(`http://localhost:5000/api/bookings/${bookingId}`, this.getAuthHeaders())
        this.booking = response.data
      } catch (error) {
        console.error('Error fetching booking:', error)
        if (error.response?.status === 401) {
          this.$router.push('/login')
        }
        this.booking = null
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateString).toLocaleDateString(undefined, options)
    },
    async cancelBooking() {
      if (confirm('Are you sure you want to cancel this booking?')) {
        try {
          await axios.put(`http://localhost:5000/api/bookings/${this.booking.id}/cancel`, {}, this.getAuthHeaders())
          await this.fetchBooking()
          alert('Booking cancelled successfully')
        } catch (error) {
          console.error('Error cancelling booking:', error)
          alert('Failed to cancel booking')
        }
      }
    }
  }
}
</script>

<style scoped>
.booking-detail-container {
  padding: 40px 0;
  background: #f8f9fa;
  min-height: calc(100vh - 200px);
}

.back-link {
  margin-bottom: 20px;
}

.btn-link {
  color: #2d8c4e;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.btn-link:hover {
  color: #1a5f3a;
}

.booking-detail-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.booking-header {
  padding: 30px;
  text-align: center;
  color: white;
}

.booking-header.confirmed {
  background: linear-gradient(135deg, #2d8c4e, #1a5f3a);
}

.booking-header.cancelled {
  background: linear-gradient(135deg, #888, #555);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 20px;
  border-radius: 30px;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.booking-header h1 {
  margin: 0 0 10px 0;
  font-size: 2rem;
}

.booking-content {
  padding: 30px;
}

.info-section {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
}

.info-section h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.3rem;
  margin-bottom: 20px;
  color: #2d8c4e;
}

.room-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 15px;
}

.info-section h4 {
  margin: 0 0 5px 0;
  font-size: 1.2rem;
}

.room-number {
  color: #666;
  margin: 5px 0;
}

.room-price {
  color: #2d8c4e;
  font-weight: bold;
  font-size: 1.1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;
}

.detail-row .label {
  font-weight: 500;
  color: #666;
}

.detail-row .value {
  font-weight: 600;
}

.detail-row .value.total {
  color: #2d8c4e;
  font-size: 1.2rem;
}

.cats-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

.cat-card .material-symbols-outlined {
  font-size: 32px;
  color: #2d8c4e;
}

.cat-breed, .cat-age {
  display: block;
  font-size: 0.8rem;
  color: #666;
}

.special-requests {
  background: white;
  padding: 15px;
  border-radius: 12px;
  border-left: 4px solid #2d8c4e;
  margin: 0;
}

.cancel-section {
  text-align: center;
  padding: 20px;
}

.btn-danger {
  background: #dc3545;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 30px;
  border-radius: 30px;
  font-size: 1rem;
}

.btn-danger:hover {
  background: #c82333;
}

.cancel-note {
  margin-top: 10px;
  font-size: 0.8rem;
  color: #666;
}

.no-results-icon {
  font-size: 64px;
  color: #2d8c4e;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .booking-detail-container {
    padding: 20px;
  }
  
  .booking-header {
    padding: 20px;
  }
  
  .booking-content {
    padding: 20px;
  }
  
  .booking-header h1 {
    font-size: 1.5rem;
  }
}
</style>