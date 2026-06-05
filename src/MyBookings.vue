<template>
  <div class="my-bookings-container">
    <div class="container">
      <h1>
        <span class="material-symbols-outlined">book_online</span>
        My Bookings
      </h1>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-success"></div>
        <p class="mt-3">Loading your bookings...</p>
      </div>

      <div v-else-if="bookings.length === 0" class="empty-state text-center py-5">
        <span class="material-symbols-outlined empty-icon">pets</span>
        <h3>No bookings yet</h3>
        <p>Book a suite for your cat to see it here!</p>
        <router-link to="/rooms" class="btn btn-success">
          <span class="material-symbols-outlined">search</span>
          Browse Rooms
        </router-link>
      </div>

      <div v-else class="bookings-list">
        <div v-for="booking in bookings" :key="booking.id" class="booking-card">
          <router-link :to="`/booking-detail/${booking.id}`" class="booking-link">
            <div class="booking-status" :class="booking.status">
              {{ booking.status }}
            </div>
            <div class="booking-content">
              <img :src="booking.image_url" :alt="booking.room_name" class="booking-image">
              <div class="booking-details">
                <h3>{{ booking.room_name }}</h3>
                <div class="booking-dates">
                  <span class="material-symbols-outlined">calendar_today</span>
                  {{ formatDate(booking.check_in) }} → {{ formatDate(booking.check_out) }}
                </div>
                <div class="booking-info">
                  <span class="material-symbols-outlined">nights_stay</span>
                  {{ booking.total_nights }} nights
                </div>
                <div class="booking-price">
                  <strong>Total: ${{ booking.total_amount }}</strong>
                </div>
              </div>
            </div>
          </router-link>
          <div class="booking-actions" v-if="booking.status === 'confirmed'">
            <button @click.stop="cancelBooking(booking.id)" class="btn-cancel">
              <span class="material-symbols-outlined">cancel</span>
              Cancel Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MyBookings',
  data() {
    return {
      bookings: [],
      loading: true
    }
  },
  async mounted() {
    await this.fetchBookings()
  },
  methods: {
    getAuthHeaders() {
      const token = localStorage.getItem('token')
      return {
        headers: { Authorization: `Bearer ${token}` }
      }
    },
    async fetchBookings() {
      try {
        const response = await axios.get('http://localhost:5000/api/bookings', this.getAuthHeaders())
        this.bookings = response.data
      } catch (error) {
        console.error('Error fetching bookings:', error)
        if (error.response?.status === 401) {
          this.$router.push('/login')
        }
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      return new Date(dateString).toLocaleDateString(undefined, options)
    },
    async cancelBooking(id) {
      if (confirm('Are you sure you want to cancel this booking?')) {
        try {
          await axios.put(`http://localhost:5000/api/bookings/${id}/cancel`, {}, this.getAuthHeaders())
          await this.fetchBookings()
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
.my-bookings-container {
  padding: 40px 0;
  background: #f8f9fa;
  min-height: calc(100vh - 200px);
}

h1 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
}

h1 .material-symbols-outlined {
  font-size: 40px;
  color: #2d8c4e;
}

.empty-state {
  background: white;
  border-radius: 20px;
  padding: 60px;
}

.empty-icon {
  font-size: 80px;
  color: #ccc;
}

.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.booking-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  position: relative;
}

.booking-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.booking-link:hover {
  cursor: pointer;
}

.booking-status {
  position: absolute;
  top: 15px;
  right: 20px;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  z-index: 1;
}

.booking-status.confirmed {
  background: #d4edda;
  color: #155724;
}

.booking-status.cancelled {
  background: #f8d7da;
  color: #721c24;
}

.booking-status.completed {
  background: #cce5ff;
  color: #004085;
}

.booking-status.pending {
  background: #fff3cd;
  color: #856404;
}

.booking-content {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.booking-image {
  width: 180px;
  height: 140px;
  object-fit: cover;
  border-radius: 12px;
}

.booking-details {
  flex: 1;
}

.booking-details h3 {
  margin: 0 0 10px 0;
  font-size: 1.3rem;
}

.booking-dates, .booking-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  margin-bottom: 8px;
}

.booking-dates .material-symbols-outlined,
.booking-info .material-symbols-outlined {
  font-size: 18px;
  color: #2d8c4e;
}

.booking-price {
  font-size: 1.2rem;
  margin: 12px 0;
  color: #2d8c4e;
}

.booking-actions {
  padding: 0 20px 20px 20px;
  border-top: 1px solid #eee;
  text-align: right;
}

.btn-cancel {
  background: none;
  border: 1px solid #dc3545;
  color: #dc3545;
  padding: 6px 15px;
  border-radius: 20px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #dc3545;
  color: white;
}

.btn-cancel .material-symbols-outlined {
  font-size: 16px;
}

.btn-success {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 768px) {
  .booking-content {
    flex-direction: column;
  }
  
  .booking-image {
    width: 100%;
    height: 160px;
  }
  
  .booking-status {
    position: static;
    display: inline-block;
    margin-bottom: 10px;
  }
  
  h1 {
    font-size: 1.5rem;
  }
  
  .booking-actions {
    text-align: center;
  }
}
</style>