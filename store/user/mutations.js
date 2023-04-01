export default {
  setUser (state, user) {
    state.user = user
  },
  logoutUser (state) {
    state.user = {}
  },
  setToken (state, token) {
    state.token = token
  },
  resetToken (state) {
    state.token = ''
  }
}
