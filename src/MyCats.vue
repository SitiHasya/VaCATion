<template>
  <div class="my-cats-container">
    <div class="container">
      <!-- Header -->
      <div class="header-section">
        <div class="header-text">
          <h1>
            <span class="material-symbols-outlined">pets</span>
            My Cats
          </h1>
          <p class="subtitle">Manage your cat profiles for booking</p>
        </div>
        <button class="btn btn-success add-btn" @click="openAddModal">
          <span class="material-symbols-outlined">add</span>
          Add New Cat
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-success" role="status"></div>
        <p class="mt-3 loading-text">Loading your cats...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="cats.length === 0" class="empty-state text-center py-5">
        <span class="material-symbols-outlined empty-icon">pets</span>
        <h3>No cats yet</h3>
        <p class="empty-text">Add your first cat to start booking!</p>
        <button class="btn btn-success" @click="openAddModal">
          <span class="material-symbols-outlined">add</span>
          Add Your First Cat
        </button>
      </div>

      <!-- Cats Grid -->
      <div v-else class="row g-4">
        <div v-for="cat in cats" :key="cat.id" class="col-md-6 col-lg-4">
          <div class="cat-card">
            <div class="cat-avatar">
              <span class="material-symbols-outlined">pets</span>
            </div>
            <div class="cat-info">
              <h3 class="cat-name">{{ cat.name }}</h3>
              <div class="cat-details">
                <p v-if="cat.breed">
                  <span class="material-symbols-outlined">info</span>
                  {{ cat.breed }}
                </p>
                <p v-if="cat.age">
                  <span class="material-symbols-outlined">cake</span>
                  {{ cat.age }} years old
                </p>
                <p v-if="cat.color">
                  <span class="material-symbols-outlined">palette</span>
                  {{ cat.color }}
                </p>
                <p v-if="cat.special_needs" class="special-needs">
                  <span class="material-symbols-outlined">favorite</span>
                  {{ cat.special_needs }}
                </p>
                <p v-if="cat.diet_instructions" class="diet">
                  <span class="material-symbols-outlined">restaurant</span>
                  {{ cat.diet_instructions }}
                </p>
              </div>
            </div>
            <div class="cat-actions">
              <button class="btn-icon edit" @click="openEditModal(cat)">
                <span class="material-symbols-outlined">edit</span>
              </button>
              <button class="btn-icon delete" @click="confirmDelete(cat)">
                <span class="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ isEditing ? 'Edit Cat' : 'Add New Cat' }}</h2>
          <button class="close-btn" @click="closeModal">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <form @submit.prevent="saveCat">
          <div class="form-group">
            <label>Cat Name *</label>
            <input type="text" class="form-control" v-model="form.name" required>
          </div>
          <div class="form-group">
            <label>Breed</label>
            <input type="text" class="form-control" v-model="form.breed" placeholder="e.g., Persian, Siamese">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Age (years)</label>
              <input type="number" class="form-control" v-model="form.age" min="0" max="30">
            </div>
            <div class="form-group">
              <label>Color</label>
              <input type="text" class="form-control" v-model="form.color" placeholder="e.g., Orange, Black">
            </div>
          </div>
          <div class="form-group">
            <label>Special Needs / Medical Conditions</label>
            <textarea class="form-control" v-model="form.special_needs" rows="2" placeholder="e.g., Requires medication, allergies"></textarea>
          </div>
          <div class="form-group">
            <label>Diet Instructions</label>
            <textarea class="form-control" v-model="form.diet_instructions" rows="2" placeholder="e.g., Wet food only, no chicken"></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button type="submit" class="btn btn-success" :disabled="saving">
              {{ saving ? 'Saving...' : (isEditing ? 'Update Cat' : 'Add Cat') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MyCats',
  data() {
    return {
      cats: [],
      loading: true,
      showModal: false,
      isEditing: false,
      saving: false,
      form: {
        id: null,
        name: '',
        breed: '',
        age: '',
        color: '',
        special_needs: '',
        diet_instructions: ''
      }
    }
  },
  async mounted() {
    await this.fetchCats();
  },
  methods: {
    getAuthHeaders() {
      const token = localStorage.getItem('token');
      return {
        headers: { Authorization: `Bearer ${token}` }
      };
    },
    async fetchCats() {
      try {
        const response = await axios.get('http://localhost:5000/api/cats', this.getAuthHeaders());
        this.cats = response.data;
      } catch (error) {
        console.error('Error fetching cats:', error);
        if (error.response?.status === 401) {
          this.$router.push('/login');
        }
      } finally {
        this.loading = false;
      }
    },
    openAddModal() {
      this.resetForm();
      this.isEditing = false;
      this.showModal = true;
    },
    openEditModal(cat) {
      this.form = {
        id: cat.id,
        name: cat.name,
        breed: cat.breed || '',
        age: cat.age || '',
        color: cat.color || '',
        special_needs: cat.special_needs || '',
        diet_instructions: cat.diet_instructions || ''
      };
      this.isEditing = true;
      this.showModal = true;
    },
    resetForm() {
      this.form = {
        id: null,
        name: '',
        breed: '',
        age: '',
        color: '',
        special_needs: '',
        diet_instructions: ''
      };
    },
    closeModal() {
      this.showModal = false;
      this.resetForm();
    },
    async saveCat() {
      if (!this.form.name) {
        alert('Please enter your cat\'s name');
        return;
      }
      
      this.saving = true;
      
      try {
        if (this.isEditing) {
          await axios.put(`http://localhost:5000/api/cats/${this.form.id}`, this.form, this.getAuthHeaders());
        } else {
          await axios.post('http://localhost:5000/api/cats', this.form, this.getAuthHeaders());
        }
        await this.fetchCats();
        this.closeModal();
      } catch (error) {
        console.error('Error saving cat:', error);
        alert('Failed to save cat. Please try again.');
      } finally {
        this.saving = false;
      }
    },
    confirmDelete(cat) {
      if (confirm(`Are you sure you want to delete ${cat.name}?`)) {
        this.deleteCat(cat.id);
      }
    },
    async deleteCat(id) {
      try {
        await axios.delete(`http://localhost:5000/api/cats/${id}`, this.getAuthHeaders());
        await this.fetchCats();
      } catch (error) {
        console.error('Error deleting cat:', error);
        alert('Failed to delete cat. Please try again.');
      }
    }
  }
}
</script>

<style scoped>
.my-cats-container {
  padding: 60px 0;
  background: #f8f9fa;
  min-height: calc(100vh - 200px);
}

/* Header Section - BIGGER */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
  flex-wrap: wrap;
  gap: 25px;
}

.header-text h1 {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 2.8rem;
  margin-bottom: 12px;
}

.header-text h1 .material-symbols-outlined {
  font-size: 56px;
  color: #2d8c4e;
}

.subtitle {
  font-size: 1.3rem;
  color: #666;
  margin: 0;
}

/* Add Button - BIGGER */
.add-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #2d8c4e;
  border: none;
  border-radius: 16px;
  padding: 16px 32px;
  font-size: 1.2rem;
  font-weight: 600;
}

.add-btn .material-symbols-outlined {
  font-size: 24px;
}

/* Cat Card - BIGGER */
.cat-card {
  background: white;
  border-radius: 28px;
  padding: 28px;
  display: flex;
  gap: 24px;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

.cat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.12);
}

.cat-avatar {
  flex-shrink: 0;
}

.cat-avatar .material-symbols-outlined {
  font-size: 80px;
  color: #2d8c4e;
}

.cat-info {
  flex: 1;
}

.cat-name {
  font-size: 1.7rem;
  font-weight: 700;
  margin: 0 0 15px 0;
}

.cat-details p {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.05rem;
  color: #555;
  margin: 10px 0;
}

.cat-details .material-symbols-outlined {
  font-size: 22px;
  color: #2d8c4e;
}

.special-needs {
  color: #e6a017 !important;
}

.diet {
  color: #6c5ce7 !important;
}

/* Action Buttons - BIGGER */
.cat-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  border-radius: 12px;
  transition: background 0.2s;
}

.btn-icon .material-symbols-outlined {
  font-size: 28px;
}

.btn-icon.edit:hover {
  background: #e3f2fd;
}

.btn-icon.delete:hover {
  background: #fee2e2;
}

.edit .material-symbols-outlined {
  color: #2196f3;
}

.delete .material-symbols-outlined {
  color: #f44336;
}

/* Loading Text */
.loading-text {
  font-size: 1.2rem;
  color: #666;
}

/* Empty State - BIGGER */
.empty-state {
  background: white;
  border-radius: 28px;
  padding: 80px;
}

.empty-icon {
  font-size: 100px;
  color: #ccc;
}

.empty-state h3 {
  font-size: 2.2rem;
  margin: 20px 0 15px;
}

.empty-text {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
}

/* Modal - BIGGER */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 32px;
  width: 90%;
  max-width: 650px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 32px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.9rem;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.close-btn .material-symbols-outlined {
  font-size: 32px;
  color: #666;
}

form {
  padding: 32px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 1.05rem;
}

.form-control {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #ddd;
  border-radius: 14px;
  font-size: 1.05rem;
}

.form-control:focus {
  outline: none;
  border-color: #2d8c4e;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
}

textarea.form-control {
  resize: vertical;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 18px;
  margin-top: 30px;
}

.btn-secondary {
  background: #f0f0f0;
  border: none;
  padding: 14px 28px;
  border-radius: 14px;
  font-size: 1.05rem;
  cursor: pointer;
  font-weight: 600;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.btn-success {
  background: #2d8c4e;
  border: none;
  padding: 14px 32px;
  border-radius: 14px;
  font-size: 1.05rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

/* Responsive */
@media (max-width: 768px) {
  .my-cats-container {
    padding: 40px 0;
  }
  
  .header-section {
    flex-direction: column;
    text-align: center;
  }
  
  .header-text h1 {
    font-size: 2rem;
    justify-content: center;
  }
  
  .header-text h1 .material-symbols-outlined {
    font-size: 44px;
  }
  
  .subtitle {
    font-size: 1.1rem;
  }
  
  .add-btn {
    padding: 12px 24px;
    font-size: 1rem;
  }
  
  .cat-card {
    flex-direction: column;
    text-align: center;
    padding: 24px;
  }
  
  .cat-actions {
    flex-direction: row;
    justify-content: center;
    margin-top: 15px;
  }
  
  .cat-name {
    font-size: 1.5rem;
  }
  
  .cat-details p {
    justify-content: center;
    font-size: 0.95rem;
  }
  
  .empty-state {
    padding: 50px 30px;
  }
  
  .empty-state h3 {
    font-size: 1.6rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .modal-content {
    width: 95%;
  }
  
  .modal-header h2 {
    font-size: 1.5rem;
  }
  
  .modal-header {
    padding: 20px 24px;
  }
  
  form {
    padding: 24px;
  }
}
</style>