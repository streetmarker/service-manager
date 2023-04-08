export default {
  async fetchUser ({ commit }, Login) {
    const response = await this.$axios.get(`/api/details/${Login}`)
    commit('setUser', response.data.rows[0])
  },
  logoutAction ({ commit }) {
    commit('logoutUser')
    commit('resetToken')
  },
  async fetchToken ({ commit }, userData) {
    try {
      const response = await this.$axios.post('/api/login', userData)
      // eslint-disable-next-line no-console
      console.log(response)
      commit('setToken', response.data.token)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
      return error
    }
  }
}
