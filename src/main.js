import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";
import store from "./store/index.js";
import BaseButton from "./components/ui/BaseButton.vue";
import BaseSpinner from "./components/ui/BaseSpinner.vue";
import BaseDialog from "./components/ui/BaseDialog.vue";
import BaseContainer from "./components/ui/BaseContainer.vue";
// import TestTest from "./pages/search/TestTest.vue";

const app = createApp(App);
app.use(router);
app.use(store);

app.component("base-button", BaseButton);
app.component("base-spinner", BaseSpinner);
app.component("base-dialog", BaseDialog);
app.component("base-container", BaseContainer);
// app.component("test-test", TestTest);

app.mount("#app");
