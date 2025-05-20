import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: null as any | null,
    profile: null as any | null,
    isAuthenticated: false as boolean,
    token: null as string | null,
  }),

  actions: {
    setUser(user: any) {
      this.user = user
      this.isAuthenticated = true
      this.token = user.token

      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', user.token)
      }
    },
    setProfile(profile: any) {
      this.profile = profile
      if (typeof window !== 'undefined') {
        localStorage.setItem('profile', JSON.stringify(profile))
      }
    },
    clearUser() {
      this.user = null
      this.profile = null
      this.isAuthenticated = false
      this.token = null

      if (typeof window !== 'undefined') {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('profile')
      }
    },
    loadUserFromStorage() {
      if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('user')
        const tokenData = localStorage.getItem('token')
        const profileData = localStorage.getItem('profile')
        if (userData && tokenData) {
          this.user = JSON.parse(userData)
          this.token = tokenData
          this.isAuthenticated = true
          if (profileData) {
            this.profile = JSON.parse(profileData)
          }
        }
      }
    }
  },

  getters: {
    getUser: (state) => state.user,
    getProfile: (state) => state.profile,
    isLoggedIn: (state) => state.isAuthenticated,
    getToken: (state) => state.token
  }
})
