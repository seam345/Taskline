import Vue from "vue";
import Login from "./Login";
import dotenv from "dotenv";
dotenv.config();

Vue.config.productionTip = false;

new Vue({
  render: h => h(Login)
}).$mount("#app");
