import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/Home.vue'
import Rooms from '@/Rooms.vue'
import RoomDetail from '@/RoomDetail.vue'
import Booking from '@/Booking.vue'
import MyCats from '@/MyCats.vue'
import MyBookings from '@/MyBookings.vue'
import BookingDetail from '@/BookingDetail.vue'
import Login from '@/Login.vue'
import Register from '@/Register.vue'
import Contact from '@/Contact.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/rooms', name: 'Rooms', component: Rooms },
  { path: '/room/:id', name: 'RoomDetail', component: RoomDetail },
  { path: '/booking/:roomId', name: 'Booking', component: Booking },
  { path: '/my-cats', name: 'MyCats', component: MyCats },
  { path: '/my-bookings', name: 'MyBookings', component: MyBookings },
  { path: '/booking-detail/:id', name: 'BookingDetail', component: BookingDetail },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/contact', name: 'Contact', component: Contact }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router