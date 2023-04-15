export default {
  setCustomer (state, user) {
    state.customer = user
  },
  logoutCustomer (state) {
    state.customer = {}
  },
  setTokenCustomer (state, token) {
    state.token = token
  },
  resetTokenCustomer (state) {
    state.token = ''
  }
}
