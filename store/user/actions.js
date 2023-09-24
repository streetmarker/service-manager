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
      commit('setToken', response.data.token)
    } catch (error) {
      return error
    }
  },
  async fetchFaultsList ({ commit }, userId) {
    const body = {
      svmId: userId
    }
    try {
      const response = await this.$axios.post('api/getAssignedFaults', body)
      const faultsList = response.data.rows
      const response2 = await this.$axios.get('api/getSlotHour')
      const hoursDict = response2.data.rows
      console.log('hours dict', hoursDict)
      console.log('faults list: ', faultsList)
      faultsList.forEach((el) => {
        const obj = hoursDict.find(obj => obj.id === el.slothour_id)
        el.hour = obj.value
      })
      const arr = faultsList.map(item => ({
        ...item,
        date: item.date.substring(0, 10) + ' (' + item.hour + ')',
        display_name: item.display_name.substring(0, 15) + '...'
      }))
      commit('setFaultsList', arr)
    } catch (error) {
      return error
    }
  }
}
