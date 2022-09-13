export default {
  setUser(state, payload) {
    state.token = payload.token;
    state.userId = payload.userId;
    state.didAutoLogout = false;
  },
  setLastUrl(state, payload) {
    state.lastUrl = payload;
  },
  setAutoLogout(state) {
    state.didAutoLogout = true;
  },
};
