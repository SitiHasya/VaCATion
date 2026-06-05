<template>
  <div class="booking-container">
    <div class="container">
      <div class="row">
        <!-- Booking Form -->
        <div class="col-lg-7">
          <div class="booking-card">
            <h2>
              <span class="material-symbols-outlined">calendar_today</span>
              Book Your Cat's Stay
            </h2>
            
            <form @submit.prevent="submitBooking">
              <!-- Select Dates -->
              <div class="form-section">
                <h3>
                  <span class="material-symbols-outlined">date_range</span>
                  Select Dates
                </h3>
                <div class="row">
                  <div class="col-md-6">
                    <label>Check-in Date</label>
                    <input type="date" class="form-control" v-model="booking.check_in" 
                           :min="minDate" @change="calculateTotal" required>
                  </div>
                  <div class="col-md-6">
                    <label>Check-out Date</label>
                    <input type="date" class="form-control" v-model="booking.check_out" 
                           :min="booking.check_in" @change="calculateTotal" required>
                  </div>
                </div>
              </div>

              <!-- Select Cats -->
              <div class="form-section">
                <h3>
                  <span class="material-symbols-outlined">pets</span>
                  Select Cats
                </h3>
                <div v-if="cats.length === 0" class="alert alert-warning">
                  You haven't added any cats yet. 
                  <router-link to="/my-cats">Add a cat first</router-link>
                </div>
                <div v-else class="cat-checkboxes">
                  <label v-for="cat in cats" :key="cat.id" class="cat-option">
                    <input type="checkbox" :value="cat.id" v-model="booking.cat_ids">
                    <span class="cat-name">{{ cat.name }}</span>
                    <span class="cat-breed">{{ cat.breed || 'Mixed' }}</span>
                  </label>
                </div>
              </div>

              <!-- Special Requests -->
              <div class="form-section">
                <h3>
                  <span class="material-symbols-outlined">note_add</span>
                  Special Requests
                </h3>
                <textarea class="form-control" v-model="booking.special_requests" 
                          rows="3" placeholder="Any special instructions or requests?"></textarea>
              </div>

              <button type="submit" class="btn btn-success btn-lg w-100" :disabled="!canBook">
                <span class="material-symbols-outlined">check_circle</span>
                Confirm Booking
              </button>
            </form>
          </div>
        </div>

        <!-- Price Summary -->
        <div class="col-lg-5">
          <div class="summary-card">
            <h3>
              <span class="material-symbols-outlined">receipt</span>
              Booking Summary
            </h3>
            
            <div v-if="room" class="room-info">
              <img :src="room.image_url" :alt="room.name">
              <h4>{{ room.name }}</h4>
              <p class="price">${{ room.price_per_night }}/night</p>
            </div>

            <div class="summary-details" v-if="nights > 0">
              <div class="summary-row">
                <span>{{ nights }} night(s)</span>
                <span>${{ subtotal }}</span>
              </div>
              <div class="summary-row">
                <span>Number of cats</span>
                <span>{{ booking.cat_ids.length }}</span>
              </div>
              <div class="summary-row total">
                <span>Total</span>
                <span>${{ total }}</span>
              </div>
            </div>

            <div v-else class="empty-summary">
              <span class="material-symbols-outlined">event</span>
              <p>Select dates to see price</p>
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
  name: 'Booking',
  data() {
    return {
      room: null,
      cats: [],
      availableRoomId: null,
      loading: true,
      minDate: new Date().toISOString().split('T')[0],
      booking: {
        room_type_id: null,
        check_in: '',
        check_out: '',
        cat_ids: [],
        special_requests: ''
      }
    }
  },
  computed: {
    nights() {
      if (!this.booking.check_in || !this.booking.check_out) return 0
      const start = new Date(this.booking.check_in)
      const end = new Date(this.booking.check_out)
      const diffTime = Math.abs(end - start)
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    },
    subtotal() {
      if (!this.room) return 0
      return this.nights * parseFloat(this.room.price_per_night)
    },
    total() {
      return this.subtotal
    },
    canBook() {
      return this.booking.check_in && 
             this.booking.check_out && 
             this.booking.cat_ids.length > 0 &&
             this.nights > 0
    }
  },
  async mounted() {
    const roomTypeId = this.$route.params.roomId
    this.booking.room_type_id = roomTypeId
    await this.fetchRoomType(roomTypeId)
    await this.fetchAvailableRoom(roomTypeId)
    await this.fetchCats()
  },
  methods: {
    getAuthHeaders() {
      const token = localStorage.getItem('token')
      return {
        headers: { Authorization: `Bearer ${token}` }
      }
    },
    async fetchRoomType(id) {
      try {
        const response = await axios.get(`http://localhost:5000/api/rooms/${id}`)
        this.room = response.data
      } catch (error) {
        console.error('Error fetching room type:', error)
        this.$router.push('/rooms')
      }
    },
    async fetchAvailableRoom(roomTypeId) {
      try {
        const response = await axios.get(`http://localhost:5000/api/rooms/available/${roomTypeId}`)
        this.availableRoomId = response.data.available_room_id
      } catch (error) {
        console.error('Error fetching available room:', error)
      }
    },
    async fetchCats() {
      try {
        const response = await axios.get('http://localhost:5000/api/cats', this.getAuthHeaders())
        this.cats = response.data
      } catch (error) {
        console.error('Error fetching cats:', error)
        if (error.response?.status === 401) {
          this.$router.push('/login')
        }
      } finally {
        this.loading = false
      }
    },
    calculateTotal() {
      // Auto-calculated via computed properties
    },
    async submitBooking() {
      if (!this.availableRoomId) {
        alert('Sorry, no rooms available for these dates. Please try different dates.')
        return
      }
      
      try {
        const response = await axios.post('http://localhost:5000/api/bookings', {
          room_id: this.availableRoomId,
          check_in: this.booking.check_in,
          check_out: this.booking.check_out,
          cat_ids: this.booking.cat_ids,
          special_requests: this.booking.special_requests
        }, this.getAuthHeaders())
        
        alert('Booking confirmed!')
        this.$router.push('/my-bookings')
      } catch (error) {
        console.error('Booking error:', error)
        alert('Failed to create booking. Please try again.')
      }
    }
  }
}
</script>

<style scoped>
.booking-container {
  padding: 40px 0;
  background: #f8f9fa;
  min-height: calc(100vh - 200px);
}

.booking-card, .summary-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
}

.booking-card h2, .summary-card h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 25px;
  font-size: 1.5rem;
}

.form-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.form-section h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: #2d8c4e;
}

.cat-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cat-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.cat-option:hover {
  background: #f0fdf4;
  border-color: #2d8c4e;
}

.cat-option input {
  width: 20px;
  height: 20px;
}

.cat-name {
  font-weight: 600;
}

.cat-breed {
  color: #666;
  font-size: 0.85rem;
}

.summary-card .room-info {
  text-align: center;
  margin-bottom: 20px;
}

.summary-card .room-info img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 15px;
}

.summary-card .room-info h4 {
  margin: 0 0 5px 0;
}

.summary-card .room-info .price {
  color: #2d8c4e;
  font-weight: bold;
}

.summary-details {
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.summary-row.total {
  border-top: 2px solid #2d8c4e;
  margin-top: 10px;
  padding-top: 15px;
  font-weight: bold;
  font-size: 1.2rem;
  color: #2d8c4e;
}

.empty-summary {
  text-align: center;
  padding: 30px;
  color: #999;
}

.empty-summary .material-symbols-outlined {
  font-size: 48px;
}

.btn-success {
  background: #2d8c4e;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  font-size: 1.1rem;
}

.alert-warning {
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  color: #856404;
  padding: 12px;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .booking-card, .summary-card {
    padding: 20px;
  }
  
  .booking-container {
    padding: 20px 0;
  }
}
</style>