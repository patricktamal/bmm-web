import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import mediaPlayer from "./plugins/mediaPlayer";
import auth0 from "./plugins/auth0";
import bmmApi from "./plugins/bmm-api";
import i18n from "./plugins/i18n";

const app = createApp(App);

app.use(router);

app.use(auth0);

app.use(bmmApi);

app.use(i18n);

app.use(mediaPlayer);

app.use(createPinia());

app.mount("#app");
