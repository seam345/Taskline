<template>
  <div class="root-div">
    <h1>Welcome to Taskline</h1>
    <h1>
      A GanttChart view for
      <img height="40px" :src="'./trello-logo-blue.svg'" />
    </h1>
    <button @click="trelloLogin()">
      <img height="20px" :src="'./trello-mark-blue.svg'" /> Log in with Trello
    </button>

    <p>
      All data for this application is stored either on your machine or on
      Trello.<br />I created Taskline as a way to visualise my Trello cards
      differenly
    </p>
  </div>
</template>

<script>
import { RestTrello } from "../services/restTrello";
import { TokenService } from "../services/storageToken";

export default {
  name: "LoginComponent",
  created() {
    TokenService.removeToken(); //going to login page logs you out
  },
  methods: {
    trelloLogin() {
      console.log(RestTrello.createAuthURL());
      window.location.href = RestTrello.createAuthURL();
    }
  }
};
</script>

<style lang="scss" scoped>
.root-div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: map-get($main, 500);
}
button {
  font-size: 16pt;
}
</style>
