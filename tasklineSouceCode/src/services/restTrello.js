import axios from "axios";
import { TokenService } from "./storageToken";

export const TRELLO_RETURN_PATH = "/trello_auth_token.html";
// export const TRELLO_RETURN_FILENAME = "trello_auth_token.html";
const DEFAULT_EXPIRATION = "30days";
const DISPLAY_NAME = "Taskline";
const DEFAULT_SCOPE = "read,write";
const AUTH_URL = "https://trello.com/1/authorize";
const DEFAULT_AUTH_URL =
  AUTH_URL +
  "?expiration=" +
  DEFAULT_EXPIRATION +
  "&name=" +
  DISPLAY_NAME +
  "&key=" +
  process.env.VUE_APP_API_KEY +
  "&scope=" +
  DEFAULT_SCOPE;
const TRELLO_BASE_URL = "https://api.trello.com/1";
const START_DATE_LOCAL_STORE_KEY = "Trello start date ID";


const RestTrello = {
  currentBoardID: "",
  createAuthURL() {
    console.log(process.env.VUE_APP_HOST_URL);
    console.log(
      DEFAULT_AUTH_URL +
        "&return_url=" +
        process.env.VUE_APP_HOST_URL +
        TRELLO_RETURN_PATH
    );
    return (
      DEFAULT_AUTH_URL +
      "&return_url=" +
      process.env.VUE_APP_HOST_URL +
      TRELLO_RETURN_PATH
    );
  },
  getListDetails() {
    return [
      {
        id: "1",
        name: "Trello Boards",
        populateFunction: this.getBoardList, // first item, cannot  require any arguments
        getItemsFunction: this.getCardsInBoard, // uses selected option ID to pass
        displayList: [],
        currentlySelected: ""
      },
      {
        id: "2",
        name: "Board Lists",
        populateFunction: this.getListList, // uses selected option ID of item before
        getItemsFunction: this.getCardsInList, // uses selected option ID to pass
        displayList: [],
        currentlySelected: ""
      }
    ];
  },
  getOptions() {
    return [{}];
  },
  getBoardList() {
    const endPoint = "/members/me/boards";
    const keyToken =
      "?key=" +
      process.env.VUE_APP_API_KEY +
      "&token=" +
      TokenService.getToken();
    return axios.get(TRELLO_BASE_URL + endPoint + keyToken).then(response => {
      console.log(response);
      return response.data;
    });
  },
  getListList(boardID) {
    console.log("getListList @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Called");
    console.log(boardID);
    const endPoint = "/boards/" + boardID + "/lists";
    const keyToken =
      "?key=" +
      process.env.VUE_APP_API_KEY +
      "&token=" +
      TokenService.getToken();
    return axios.get(TRELLO_BASE_URL + endPoint + keyToken).then(response => {
      console.log(response);
      return response.data;
    });
  },
  getCardsInBoard(boardID) {
    RestTrello.currentBoardID = boardID;
    console.log("getCardsInBoard @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Called");
    console.log(boardID);
    const endPoint = "/boards/" + boardID + "/cards";
    const keyToken =
      "?key=" +
      process.env.VUE_APP_API_KEY +
      "&customFieldItems=true&token=" +
      TokenService.getToken();
    return RestTrello.getStartDate(boardID).then(response => {
      return axios
        .get(TRELLO_BASE_URL + endPoint + keyToken)
        .then(response2 => {
          console.log(response2);
          console.log(response);

          console.log();

          return RestTrello.convertTrelloCardsToTaskLineTasks(
            response,
            response2.data
          );
        });
    });
  },
  getCardsInList(listID) {
    // uses selected option ID to pass
    console.log("getCardsInList @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Called");
    console.log(listID);
    const endPoint = "/lists/" + listID + "/cards";
    const keyToken =
      "?key=" +
      process.env.VUE_APP_API_KEY +
      "&customFieldItems=true&token=" +
      TokenService.getToken();
    // TODO lookup if its oki to store a veriable like i stored currentBoardID
    return RestTrello.getStartDate(RestTrello.currentBoardID).then(response => {
      return axios
        .get(TRELLO_BASE_URL + endPoint + keyToken)
        .then(response2 => {
          console.log(response2);
          console.log(response);

          console.log();

          return RestTrello.convertTrelloCardsToTaskLineTasks(
            response,
            response2.data
          );
        });
    });

    /*return axios.get(TRELLO_BASE_URL + endPoint + keyToken).then(response =>
    {
      console.log(response);
      return response.data;
    });*/
  },

  // This will take an array of custom fields and return an array of valid start date fields, hopefully there is only 1
  getValidCustomFieldStartDates(customFieldArray) {
    let validStartDates = [];

    for (let i = 0; i < customFieldArray.length; i++) {
      if (customFieldArray[i]["type"] === "date") {
        if (RestTrello.nameIsStartDate(customFieldArray[i]["name"])) {
          validStartDates.push(customFieldArray[i]);
        }
      }
    }

    return validStartDates;
  },
  updateCardDates(task) {
    /* curl -X PUT -H "Content-Type: application/json" \
     https://api.trello.com/1/card/5a4d294ff7239936994177f3/customField/5a6a23abf958725e1ac86c21/item \
     -d '{
     "value": {"text": "High"},
     "key": "",
         "token": ""
   }'*/

    // const customFieldKey = RestTrello.getStartDate();

    return RestTrello.getStartDate(RestTrello.currentBoardID).then(
      customFieldKey => {
        const token = TokenService.getToken();
        const key = process.env.VUE_APP_API_KEY;
        let url =
          TRELLO_BASE_URL +
          "/card/" +
          task.id +
          "/customField/" +
          customFieldKey +
          "/item";
        return axios
          .put(url, { value: { date: task.startDate }, key: key, token: token })
          .then(response => {
            console.log(response);
            /*      curl --request PUT \
      --url 'https://api.trello.com/1/cards/id?due=1555-10-14'*/
            //todo test responce came back ok
            const keyToken = "?key=" + key + "&token=" + token;
            let url2 =
              TRELLO_BASE_URL +
              "/card/" +
              task.id +
              keyToken +
              "&due=" +
              task.endDate;
            return axios.put(url2).then(response => {
              console.log("hey");
              console.log(response);
              return response;
            });
          });
      }
    );
  },
  getStartDate(boardID) {
    // TODO need some way to test its validity of board, oh maybe just store the board ID with the date ID
    // IDK how to resolve the first promis with another promise so i used .then to return a new promise if nesaserry
    return new Promise(function(resolve) {
      let key = null;
      try {
        let keyAndBoard = localStorage.getItem(START_DATE_LOCAL_STORE_KEY);
        if (keyAndBoard != null) {
          let split = keyAndBoard.split(" ");
          if (split[1] === boardID) {
            // check the saved ID is for this board
            key = split[0];
          }
        }
      } catch (e) {
        console.log(e);
      }

      resolve(key);
    }).then(result => {
      if (result != null) {
        return result;
      } else {
        const keyToken =
          "?key=" +
          process.env.VUE_APP_API_KEY +
          "&customFieldItems=true&token=" +
          TokenService.getToken();
        const customKeysEndPoint = "/boards/" + boardID + "/customFields";

        return axios
          .get(TRELLO_BASE_URL + customKeysEndPoint + keyToken)
          .then(result => {
            console.log("getCustomKeys@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            console.log(result);
            console.log(RestTrello.getValidCustomFieldStartDates(result.data));
            const startDateField = RestTrello.getValidCustomFieldStartDates(
              result.data
            )[0]; // need to make sure that if no user makes any changes to any start dates that i always get the same one.
            localStorage.setItem(
              START_DATE_LOCAL_STORE_KEY,
              startDateField["id"] + " " + boardID
            );
            console.log("getCustomKeys@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            return startDateField["id"];
          });
      }
    });
  },
  nameIsStartDate(nameString) {
    // todo maybe perform some regex or something
    const lowerCasedName = nameString.toLowerCase(); // Trello custom field char case doesn't matter
    if (lowerCasedName === "startdate") {
      return true;
    } else if (lowerCasedName === "start date") {
      return true;
    } else if (lowerCasedName === "start dates") {
      return true;
    } else if (lowerCasedName === "startdates") {
      return true;
    }
    return false;
  },
  convertTrelloCardsToTaskLineTasks(startDateFieldID, trelloCardList) {
    let tasklineTaskGroups = [];

    for (let i = 0; i < trelloCardList.length; i++) {
      let tempTaskGroup = { id: Math.random(), tasks: [] };
      let tempTask = {
        name: "",
        startDate: null,
        endDate: null,
        id: Math.random(),
        left: 0,
        width: 0
      }; // using math.random just incase
      tempTask.id = trelloCardList[i]["id"];
      tempTask.name = trelloCardList[i]["name"];
      tempTask.endDate = trelloCardList[i]["due"];
      for (let j = 0; j < trelloCardList[i]["customFieldItems"].length; j++) {
        if (
          trelloCardList[i]["customFieldItems"][j]["idCustomField"] ===
          startDateFieldID
        ) {
          tempTask.startDate =
            trelloCardList[i]["customFieldItems"][j]["value"]["date"];
        }
      }
      tempTaskGroup.tasks.push(tempTask);
      tasklineTaskGroups.push(tempTaskGroup);
    }
    return tasklineTaskGroups;
  }
};

export { RestTrello };
