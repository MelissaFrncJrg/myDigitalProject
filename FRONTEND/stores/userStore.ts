import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: null as any | null,
    isAuthenticated: false as boolean,
    token: null as string | null,
  }),

  actions: {
    setUser(user: any) {
      this.user = user;
      this.isAuthenticated = true;
      this.token = user.token;

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", user.token);
      }
    },

    clearUser() {
      this.user = null;
      this.isAuthenticated = false;
      this.token = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    },

    loadUserFromStorage() {
      if (typeof window !== "undefined") {
        const userData = localStorage.getItem("user");
        const tokenData = localStorage.getItem("token");

        if (userData && tokenData) {
          this.user = JSON.parse(userData);
          this.token = tokenData;
          this.isAuthenticated = true;
        }
      }
    },
  },

  getters: {
    getUser: (state) => state.user,
    getProfile: (state) => state.user?.profile ?? null,
    isLoggedIn: (state) => state.isAuthenticated,
    getToken: (state) => state.token,
  },
});
