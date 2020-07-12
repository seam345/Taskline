import Vue from "vue";
import Router from "vue-router";
import GanttChart from "./views/GanttChart";
import LoginComponent from "./views/LoginComponent";
import { TokenService } from "./services/storageToken";
import AuthReturnTrello from "./views/AuthReturnTrello";
import {TRELLO_RETURN_PATH} from "./services/restTrello";

// export const TRELLO_RETURN_PATH = "/trello_auth_token";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.VUE_APP_HOST_URL,
  routes: [
    {
      path: "/",
      name: "ganttChart",
      component: GanttChart
    },
    {
      path: "/login",
      name: "loginComponent",
      component: LoginComponent,
      meta: {
        public: true // Allow access to even if not logged in
      }
    },
    {
      path: TRELLO_RETURN_PATH,
      name: "authReturn",
      component: AuthReturnTrello,
      meta: {
        public: true // Allow access to even if not logged in
      }
    }
  ]
});

// router.beforeEach((to, from, next) => {
//   const isPublic = to.matched.some(record => record.meta.public);
//   const loggedIn = !!TokenService.getToken(); // idk if I like this hack of !! to get a  boolean from a string
//
//   if (!isPublic && !loggedIn) {
//     return next({
//       path: "./login",
//       // query: { redirect: to.fullPath } // Store the full path to redirect the user to after login
//     });
//   }
//
//   next();
// });

export default router;
