export default {
  userId(state) {
    return state.userId;
  },
  userMail(state) {
    return state.userMail;
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
  registerFromMainPage(state) {
    return state.registerFromMainPage;
  },
};
