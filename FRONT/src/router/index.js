import { createRouter, createWebHistory } from 'vue-router'
import auth from '../middleware/auth';
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import LogoutView from '../views/LogoutView.vue'
import PostView from '../views/PostView.vue'
import EditView from '../views/EditView.vue'
import RegisterView from '../views/RegisterView.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView,
    meta: {
      meta: { title: 'Index' }
    }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: {
      meta: { title: 'Register' }
    }
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: {
      middleware: [auth],
      meta: { title: 'Accueil' }
    },
  },
  {
    path: '/logout',
    name: 'Logout',
    component: LogoutView,
    meta: {
      meta: { title: 'Logout' }
    }
  },
  {
    path: '/post/:id',
    name: 'Post',
    component: PostView,
  },
  {
    path: '/edit/:id',
    name: 'Edit',
    component: EditView,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
