export default {
  userId(state) {
    return state.userId;
  },
  token(state) {
    return state.token;
  },
  isAuthenticated(state) {
    return !!state.token;
  },
  getLastUrl(state) {
    return state.lastUrl;
  },
  didAutoLogout(state) {
    return state.didAutoLogout;
  },
};
