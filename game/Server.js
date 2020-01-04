/**
 * Create connection to prolog
 */
class Server {
    constructor(game) {
        this.port = 8081;
        this.game = game;
    };

    /**
    * @param  {string} requestString prolog command
    * @param  {function} onSuccess   function that is run on request success
    * @param  {function} onError   function that is called on request error
    */
    makeRequest(requestString, onSuccess, onError) {
        var requestPort = this.port;
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

        request.onload = onSuccess || function (data) { console.log("Request successful. Reply: " + data.target.response); };
        request.onerror = onError || function () { console.log("Error waiting for response"); };

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }
};