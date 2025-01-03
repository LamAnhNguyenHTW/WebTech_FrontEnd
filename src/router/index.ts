import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LogIn.vue'),
    },
    {
      path: '/produkt',
      name: 'produkt',

      component: () => import('../views/ProduktView.vue'),
    },
    {
      path: '/kunde',
      name: 'kunde',

      component: () => import('../views/KundenView.vue'),
    },
    {
      path: '/lieferant',
      name: 'lieferant',

      component: () => import('../views/LieferantView.vue'),
    },
    {
      path: '/warenbewegung',
      name: 'warenbewegung',

      component: () => import('../views/Warenbewegung.vue'),
    },
    {
      path: '/inventur',
      name: 'inventur',

      component: () => import('../views/InventurView.vue'),
    }
  ],
})

export default router
