/**
  * MyGame class
  * @constructor
  * @param {XMLScene} scene - reference to MyScene object
  */

class MyGame extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.graph = this.scene.graph;
        this.textures = this.graph.piece_textures;

        this.server = new Server(this);
        this.board = new MyBoard(this.scene);

        this.gameInCourse = false;
        
        this.timeout = 15;
        this.info = "Welcome to EXO! \nStart a game";

        this.scene.setPickEnabled(false);

        this.initGame();
    }

    initGame() {
        this.player1turn = true;
        this.player2turn = false;
        this.animsAdded = false;

        this.player1points = -1;
        this.player2points = -1;

        this.lastPlays = [];
        this.animations = [];

        this.createInitialBoards();
        this.createPlanets();
    }

    startGame() {
        this.scene.setPickEnabled(true);

        this.initGame();

        if (this.player1turn)
            this.info = "Player 1 turn";
        else if (this.player2turn)
            this.info = "Player 2 turn";

        this.gameInCourse = true;
        this.lastPlays = [];
        this.animations = [];

        this.lastTimePlayed = this.scene.deltaTime;
    }

    quitGame() {
        this.scene.setPickEnabled(false);
        this.gameInCourse = false;

        this.info = "Game quited!";
    }

    // Create the initial boards for each player
    createInitialBoards() {
        this.boardP1 = [];
        this.boardP2 = [];

        for (var i = 0; i < 27; i++) {
            this.boardP1[i] = new Array(27);
            this.boardP2[i] = new Array(27);

            for (var j = 0; j < 27; j++) {
                this.boardP1[i][j] = "empty";
                this.boardP2[i][j] = "empty";
            }
        }

        this.boardP1[13][13] = "sun";
        this.boardP2[13][13] = "sun";
    }

    // Create the planets that are going to be pieces of the game
    createPlanets() {
        this.planets = [];
        for (var planet = 0; planet < 10; planet++) {
            var id = planet + 1486;
            var texture = this.textures[planet];
            var initial = vec3.fromValues(-2, 0.1, (planet % 7) - 3);

            var prologPlanet = texture[0].substring(3, 6);

            var obj = new MyPlanet(this.scene, id, prologPlanet, texture[1], false, initial, null, null);

            this.planets.push(obj);
        }
    }

    undoLastPlay() {
        if (this.replay != true & this.gameInCourse == true) {
            if (this.lastPlays.length != 0) {
                var lastPlay = this.lastPlays.pop();

                if (this.player2turn) {
                    var x = 28 - lastPlay.final[2];
                    var y = lastPlay.final[0];
                    this.boardP1[y][x] = 'empty';
                    this.player2turn = false;
                    this.player1turn = true;
                    this.info = "Player 1 turn";
                }
                else if (this.player1turn) {
                    var x = 0 - lastPlay.final[2];
                    var y = lastPlay.final[0];
                    this.boardP2[y][x] = 'empty';
                    this.player2turn = true;
                    this.player1turn = false;
                    this.info = "Player 2 turn";
                }

                lastPlay.animation = null;
                lastPlay.final = null;
                lastPlay.played = false;

                this.lastTimePlayed = this.scene.deltaTime;
            }
        }
    }

    addAnimsToReplay() {
        if (!this.animsAdded) {

            for (var i = 0; i < this.lastPlays.length; i++) {
                for (var j = 0; j < this.animations[i].keyframes.length - 1; j++) {
                    this.animations[i].keyframes[j].instant = (this.scene.deltaTime / 1000) + i + j;
                    this.animations[i].maxTime = (this.scene.deltaTime / 1000) + i + j;
                }

                this.lastPlays[i].animation = this.animations[i];
            }
            this.animsAdded = true;
        }
    }

    replayGame() {
        if (this.replay != true) {

            if (!this.gameInCourse)
                this.info = "You have to play a game to replay it."

            else if (this.lastPlays.length < this.planets.length) {
                var previous = this.info;
                this.info = "Game is still in course! \n" + previous;
            }

            else {
                this.replay = true;

                for (var j = 0; j < this.lastPlays.length; j++) {

                    this.animations.push(this.lastPlays[j].animation);
                    this.lastPlays[j].animation = null;
                }
            }
        }
    }

    checkWinner() {
        var game = this;

        var converted1 = this.getBoardString(this.boardP1);
        var request1 = `points(${converted1})`;

        this.server.makeRequest(request1, function (data) {
            var response = data.target.response;
            game.player1points = response;
        });

        var converted2 = this.getBoardString(this.boardP2);
        var request2 = `points(${converted2})`;

        this.server.makeRequest(request2, function (data) {
            var response = data.target.response;
            game.player2points = response;
        });
    }

    display() {
        this.scene.pushMatrix();
        this.board.display();
        this.scene.popMatrix();

        this.whiteTile = new CGFappearance(this.scene);
        this.whiteTile.setAmbient(1, 1, 1, 1);
        this.whiteTile.setDiffuse(1, 1, 1, 1);
        this.whiteTile.setSpecular(1, 1, 1, 1);
        this.whiteTile.setEmission(0, 0, 0, 1);

        if (this.replay) {
            this.addAnimsToReplay(this.scene.deltaTime);
        }

        if ((this.player1points == -1) & (this.player2points == -1)) {
            if (this.lastPlays.length == this.planets.length) {
                this.info = "The game has ended!\nChecking winner...";
                this.scene.setPickEnabled(false);
                this.checkWinner();
            }
        }
        else if ((this.player1points != -1) & (this.player2points != -1)) {

            var winner;

            if (this.player2points > this.player1points)
                winner = "The winner is Player 2!";
            else if (this.player2points < this.player1points)
                winner = "The winner is Player 1!";
            else
                winner = "It's a tie!";

            this.info = "Player 1 points: " + this.player1points + "\nPlayer 2 points: " + this.player2points + "\n" + winner;

        }

        if (this.gameInCourse) {
            this.time = (this.timeout + this.lastTimePlayed / 1000) - (this.scene.deltaTime / 1000);
            document.getElementById("info").innerText = this.info + "\n" + this.time.toFixed(0);
        }
        else
            document.getElementById("info").innerText = this.info;

        if ((this.gameInCourse) & ((this.timeout * 1000 + this.lastTimePlayed) < this.scene.deltaTime)) {
            if (this.player1turn) {
                this.player2turn = true;
                this.player1turn = false;
                this.info = "Time finished!\nPlayer 2 turn";
            }
            else if (this.player2turn) {
                this.player1turn = true;
                this.player2turn = false;
                this.info = "Timed finished!\nPlayer 1 turn";
            }

            this.lastTimePlayed = this.scene.deltaTime;
        }


        for (var j = 0; j < this.planets.length; j++) {
            this.scene.pushMatrix();
            this.whiteTile.setTexture(this.planets[j].texture);
            this.whiteTile.apply();

            if (this.planets[j].animation != null) {
                if (this.scene.deltaTime / 1000 < this.planets[j].animation.maxTime)
                    this.planets[j].animation.apply();
                else
                    this.scene.translate(this.planets[j].final[0], this.planets[j].final[1] + 0.01, this.planets[j].final[2]);
            }
            else
                this.scene.translate(this.planets[j].initial[0], this.planets[j].initial[1], this.planets[j].initial[2]);

            this.scene.registerForPick(this.planets[j].id, this.planets[j]);
            this.planets[j].display();
            this.scene.clearPickRegistration();
            this.scene.popMatrix();
        }

        this.processPicking();
    }

    getPrologPlanet(planet) {
        var size; //small, medium or large
        var colour; //red, blue or green
        var type; //gaseous, terrestrial or green

        // get prolog's planet size
        if (planet[0] == 'S')
            size = 'small';
        else if (planet[0] == 'M')
            size = 'medium';
        else if (planet[0] == 'L')
            size = 'large';

        // get prolog's planet colour
        if (planet[1] == 'R')
            colour = 'red';
        else if (planet[1] == 'W')
            colour = 'blue';
        else if (planet[1] == 'G')
            colour = 'green';

        // get prolog's planet type
        if (planet[2] == 'R')
            type = 'ringed';
        else if (planet[2] == 'T')
            type = 'terrestrial';
        else if (planet[2] == 'G')
            type = 'gaseous';

        return size + "," + colour + "," + type;
    }

    getBoardString(board) {
        var converted = '[';

        for (var i = 0; i < board.length; i++) {
            converted += '[';
            for (var j = 0; j < board[i].length; j++) {
                if (board[i][j] == 'sun' || board[i][j] == 'empty')
                    converted += board[i][j];
                else
                    converted += ('planet(' + this.getPrologPlanet(board[i][j]) + ')');

                if (j != board[i].length - 1)
                    converted += ',';
            }
            converted += ']';

            if (i != board.length - 1)
                converted += ',';
        }

        converted += ']';

        return converted;
    }

    validateMove() {
        var board;
        var x;
        var y;

        if (this.player1turn) {
            board = this.boardP1;
            x = 28 - this.tile.position[2];
            y = this.tile.position[0];
        }
        else if (this.player2turn) {
            board = this.boardP2;
            x = 0 - this.tile.position[2];
            y = this.tile.position[0];
        }

        var converted = this.getBoardString(board);
        var request = `testMove(${x},${y},${converted})`;

        var game = this;

        this.server.makeRequest(request, function (data) {
            var response = data.target.response;

            // Se peça mal posicionada
            if (response == 1) {
                game.piece.animation = null;
                game.piece.final = null;
                game.piece.played = false;
                game.lastTimePlayed = game.scene.deltaTime;
                game.info = "A planet must be placed next to another! Try again"
            }
            // Se peça bem posicionada
            else {
                game.piece.final = game.tile.position;

                var keyframes = [];

                var keyFrameTransfs = [];
                keyFrameTransfs.push(...[game.piece.initial, vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)]);
                var keyf = new Keyframe(game.graph, game.scene.deltaTime / 1000, keyFrameTransfs);
                keyframes.push(keyf);

                var keyFrameTransfs = [];
                keyFrameTransfs.push(...[vec3.fromValues(game.piece.final[0] / 2, 3, game.piece.final[2] / 2), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)]);
                var keyf = new Keyframe(game.graph, game.scene.deltaTime / 1000 + 1, keyFrameTransfs);
                keyframes.push(keyf);

                var keyFrameTransfs = [];
                keyFrameTransfs.push(...[vec3.fromValues(game.piece.final[0], 0.15, game.piece.final[2]), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)]);
                var keyf = new Keyframe(game.graph, game.scene.deltaTime / 1000 + 2, keyFrameTransfs);
                keyframes.push(keyf);

                var keyFrameAnim = new KeyframeAnimation(game.customId, game.scene, keyframes);
                game.piece.animation = keyFrameAnim;

                game.piece.played = true;

                game.lastPlays.push(game.piece);

                if (game.player1turn) {
                    board = game.boardP1;
                    x = 28 - game.tile.position[2];
                    y = game.tile.position[0];
                    board[y][x] = game.piece.prologPlanet;
                }
                else if (game.player2turn) {
                    board = game.boardP2;
                    x = 0 - game.tile.position[2];
                    y = game.tile.position[0];
                    board[y][x] = game.piece.prologPlanet;
                }

                if (game.player2turn) {
                    game.player2turn = false;
                    game.player1turn = true;
                    game.info = "Player 1 turn";
                }
                else if (game.player1turn) {
                    game.player2turn = true;
                    game.player1turn = false;
                    game.info = "Player 2 turn";
                }

                game.tile = null;
                game.piece = null;
                game.lastTimePlayed = game.scene.deltaTime;
            }
        });
    }

    processPicking() {
        if (this.scene.pickMode == false) {
            if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
                for (var i = 0; i < this.scene.pickResults.length; i++) {

                    var obj = this.scene.pickResults[i][0];
                    if (obj) {
                        this.customId = this.scene.pickResults[i][1];
                        console.log("Picked object: " + obj + ", with pick id " + this.customId);

                        if (this.piece == null) {
                            if (this.customId < 1486)
                                console.log("Escolher peça a mover em primeiro lugar!");
                            else {
                                if (obj.played == true) {
                                    console.log("Peça já jogada!");
                                    this.info = "\n Planet already played!"
                                }
                                else {
                                    this.piece = obj;
                                    console.log("Escolheu a peça com o id " + this.piece.id);
                                }
                            }
                        }
                        else {
                            if (this.customId > 1485) {
                                if (obj.played == true) {
                                    this.info = "\n Planet already played!"
                                    console.log("Peça já jogada!");
                                }
                                else {
                                    this.piece = obj;
                                    console.log("Escolheu a peça com o id " + this.piece.id);
                                }
                            }
                            else {
                                if ((this.customId >= 1 & this.customId <= 756) & this.player1turn) {
                                    this.tile = obj;
                                    console.log("Escolheu o local com o id " + this.tile.id)
                                }
                                else if ((this.customId >= 757 & this.customId <= 1485) & this.player2turn) {
                                    this.tile = obj;
                                    console.log("Escolheu o local com o id " + this.tile.id);
                                }
                                else {
                                    this.piece = null;
                                    console.log("Wrong player!");
                                    this.info = "\nWrong board!"
                                }

                            }
                        }

                        if (this.piece != null & this.tile != null)
                            this.validateMove();

                    }
                }
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
            }
        }
    }
};