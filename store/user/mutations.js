export default {
  setUser (state, user) {
    state.user = user
  },
  logoutUser (state) {
    state.user = {
      id: 0,
      login: '',
      email: '',
      svmid: 0,
      roleid: 0,
      rolename: '',
      isadmin: false
    }
  },
  setToken (state, token) {
    state.token = token
  },
  resetToken (state) {
    state.token = ''
  },
  setFaultsList (state, faultsList) {
    state.faultsList = faultsList
  },
  resetFaultsList (state) {
    state.faultsList = []
  }
}
