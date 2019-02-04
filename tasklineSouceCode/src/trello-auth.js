import Vue from "vue";
import dotenv from "dotenv";
import TrelloAuth from "./TrelloAuth";
dotenv.config();

Vue.config.productionTip = false;

new Vue({
  render: h => h(TrelloAuth)
}).$mount("#app");
