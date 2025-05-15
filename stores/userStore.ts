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
    },
    clearUser() {
      this.user = null
      this.isAuthenticated = false
    }
  },

  getters: {
    getUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
  }
})
