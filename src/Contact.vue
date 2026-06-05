<template>
  <div class="contact-container">
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          <div class="contact-card">
            <h1>
              <span class="material-symbols-outlined">contact_support</span>
              Contact Us
            </h1>
            <p class="subtitle">Have questions about your cat's stay? We're here to help!</p>

            <form @submit.prevent="submitContact">
              <div class="form-group">
                <label>Your Name</label>
                <input type="text" class="form-control" v-model="form.name" required>
              </div>

              <div class="form-group">
                <label>Email Address</label>
                <input type="email" class="form-control" v-model="form.email" required>
              </div>

              <div class="form-group">
                <label>Subject</label>
                <select class="form-control" v-model="form.subject">
                  <option value="booking">Booking Inquiry</option>
                  <option value="cancellation">Cancellation Request</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div class="form-group">
                <label>Message</label>
                <textarea class="form-control" v-model="form.message" rows="5" required></textarea>
              </div>

              <button type="submit" class="btn btn-success w-100" :disabled="sending">
                <span class="material-symbols-outlined">send</span>
                {{ sending ? 'Sending...' : 'Send Message' }}
              </button>
            </form>

            <div class="contact-note">
              <span class="material-symbols-outlined">schedule</span>
              We typically respond within 24 hours
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="info-card">
            <h2>
              <span class="material-symbols-outlined">info</span>
              Get in Touch
            </h2>
            
            <div class="info-item">
              <span class="material-symbols-outlined">location_on</span>
              <div>
                <strong>Address</strong>
                <p>123 Purrfect Lane, Catopia City, 3000</p>
              </div>
            </div>

            <div class="info-item">
              <span class="material-symbols-outlined">phone</span>
              <div>
                <strong>Phone</strong>
                <p>(555) 123-VCAT (8228)</p>
              </div>
            </div>

            <div class="info-item">
              <span class="material-symbols-outlined">email</span>
              <div>
                <strong>Email</strong>
                <p>hello@vacation.com</p>
              </div>
            </div>

            <div class="info-item">
              <span class="material-symbols-outlined">schedule</span>
              <div>
                <strong>Business Hours</strong>
                <p>Monday - Friday: 9am - 6pm<br>Saturday: 10am - 4pm<br>Sunday: Closed</p>
              </div>
            </div>

            <div class="map-placeholder">
              <span class="material-symbols-outlined">map</span>
              <p>📍 Located in the heart of Catopia City</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Contact',
  data() {
    return {
      sending: false,
      form: {
        name: '',
        email: '',
        subject: 'booking',
        message: ''
      }
    }
  },
  methods: {
    submitContact() {
      this.sending = true
      
      setTimeout(() => {
        alert('Thank you for your message! We will get back to you soon.')
        this.form = {
          name: '',
          email: '',
          subject: 'booking',
          message: ''
        }
        this.sending = false
      }, 1000)
    }
  }
}
</script>

<style scoped>
.contact-container {
  padding: 40px 0;
  background: #f8f9fa;
  min-height: calc(100vh - 200px);
}

.contact-card, .info-card {
  background: white;
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  height: 100%;
}

h1, h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 1.8rem;
}

h1 .material-symbols-outlined, h2 .material-symbols-outlined {
  font-size: 32px;
  color: #2d8c4e;
}

.subtitle {
  color: #666;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 1rem;
}

.form-control:focus {
  outline: none;
  border-color: #2d8c4e;
}

.btn-success {
  background: #2d8c4e;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  font-size: 1rem;
  border-radius: 12px;
}

.btn-success:hover {
  background: #1a5f3a;
}

.contact-note {
  margin-top: 20px;
  text-align: center;
  font-size: 0.85rem;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.contact-note .material-symbols-outlined {
  font-size: 18px;
}

.info-item {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.info-item .material-symbols-outlined {
  font-size: 28px;
  color: #2d8c4e;
}

.info-item strong {
  display: block;
  margin-bottom: 5px;
}

.info-item p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

.map-placeholder {
  background: #f0fdf4;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  margin-top: 20px;
}

.map-placeholder .material-symbols-outlined {
  font-size: 48px;
  color: #2d8c4e;
  margin-bottom: 10px;
}

.map-placeholder p {
  margin: 0;
  color: #666;
}

@media (max-width: 768px) {
  .contact-container {
    padding: 20px;
  }
  
  .contact-card, .info-card {
    padding: 20px;
    margin-bottom: 20px;
  }
  
  h1, h2 {
    font-size: 1.5rem;
  }
  
  .info-item {
    gap: 12px;
  }
}
</style>