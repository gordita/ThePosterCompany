/**
 * @constructor
 */
function FbApi() {

}


/**
 * @type {FbEvent}
 */
FbApi.prototype.Event = null;


/**
 * @param {...*} var_args
 * @return {*}
 */
FbApi.prototype.init = function(var_args) {
};


/**
 * @param {...*} var_args
 * @return {*}
 */
FbApi.prototype.getLoginStatus = function(var_args) {
};


/**
 * @param {...*} var_args
 * @return {*}
 */
FbApi.prototype.login = function(var_args) {
};


/**
 * @param {...*} var_args
 * @return {*}
 */
FbApi.prototype.api = function(var_args) {
};


/**
 * @constructor
 */
function FbLoginData() {
}

FbLoginData.prototype = {
  "session":{
    "uid":"562910429",
    "session_key":"2.AQCzaE1QOmv8qbVQ.3600.1309471200.1-562910429",
    "secret":"sIhZSsSMpkqFcQ2jcaNg_g__",
    "expires":1309471200,
    "base_domain":"friends-list.appspot.com",
    "access_token":"196120177106863|2.AQCzaE1...",
    "sig":"d753bf84a878b0b205aaad9d72bcb493"
  },
  "status":"connected",
  "perms":"{\"extended\":[],\"user\":[],\"friends\":[]}"
};


/**
 * @constructor
 */
function FbEvent() {
}


/**
 * @param {...*} var_args
 * @return {*}
 */
FbEvent.prototype.subscribe = function(var_args) {
};