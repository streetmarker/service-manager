export default {
  async fetchUser ({ commit }, data) {
    try {
      const response = await this.$axios.get(`/api/userDetails/${data.ident}`)
      if (response.data.rows.length !== 0) {
        commit('setUser', response.data.rows[0])
      }
    } catch (error) {
      console.log(error)
    }
  },
  logoutAction ({ commit }) {
    commit('logoutUser')
    commit('resetToken')
  },
  async fetchToken ({ commit }, userData) {
    try {
      const response = await this.$axios.post('/api/userLogin', userData)
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
