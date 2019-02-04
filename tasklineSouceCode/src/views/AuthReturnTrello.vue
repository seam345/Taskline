<template>
  <p>Trello Auth Return</p>
</template>

<script>
import { TokenService } from "../services/storageToken";

export default {
  name: "AuthReturnTrello",
  created() {
    try {
      // bit overkill but nice https://stackoverflow.com/questions/23699666/javascript-get-and-set-url-hash-parameters
      let hash = window.location.hash.substr(1);
      let result = hash.split("&").reduce(function(result, item) {
          let parts = item.split('=');
          result[parts[0]] = parts[1];
          return result;
      }, {});
      console.log(result);
      console.log(result['token']);
      TokenService.saveToken(result['token']);
      console.log(process.env.VUE_APP_HOST_URL);
      window.location.href = process.env.VUE_APP_HOST_URL;
      // this.$router.push(process.env.BASE_URL);
    } catch (e) {
      console.log(e); // TODO show some message to user
    }
  }
};
</script>

<style scoped></style>
