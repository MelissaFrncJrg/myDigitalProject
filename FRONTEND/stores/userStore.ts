import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: null as any | null,
    isAuthenticated: false as boolean,
  }),

  actions: {
    setUser(user: any) {
      this.user = user
      this.isAuthenticated = true

      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user))
      }
    },
    clearUser() {
      this.user = null
      this.isAuthenticated = false

      if (typeof window !== 'undefined') {
        localStorage.removeItem('user')
      }
    },
    loadUserFromStorage() {
      if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('user')
        if (userData) {
          this.user = JSON.parse(userData)
          this.isAuthenticated = true
        }
      }
    }
  },

  getters: {
    getUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
  }
})
