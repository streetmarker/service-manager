export default {
  async fetchCustomer ({ commit }, id) {
    const response = await this.$axios.get(`/api/customerDetails/${id}`)
    commit('setCustomer', response.data.rows[0])
  },
  logoutAction ({ commit }) {
    commit('logoutCustomer')
    commit('resetTokenCustomer')
  },
  async fetchTokenCustomer ({ commit }, userData) {
    try {
      const response = await this.$axios.post('/api/customerLogin', userData)
      // eslint-disable-next-line no-console
      // console.log(response)
      commit('setTokenCustomer', response.data.token)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
      return error
    }
  }
}
