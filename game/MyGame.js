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

        this.server = new Server();
        this.board = new MyBoard(this.scene);

        this.start = false;
        this.player1turn = true;
        this.player2turn = false;
        this.replay = false;
        this.animsAdded = false;

        this.currPiece = null;
        this.currTile = null;

        this.timeout = 10;
        this.info = "Welcome to EXO! \nStart a game";

        this.lastPlays = [];
        this.animations = [];

        this.boardP1 = [
            ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'sun', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
        ];

        this.boardP2 = [
            ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'sun', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
        ];

        this.planets = [];
        for (var planet = 0; planet < 26; planet++) {
            var id = planet + 1486;
            var texture = this.textures[planet];
            var initial = vec3.fromValues(-2, 0.1, (planet % 7) - 3);

            var prologPlanet = texture[0].substring(3, 6);

            var obj = new MyPlanet(this.scene, id, prologPlanet, texture[1], false, initial, null, null);

            this.planets.push(obj);
        }

        this.scene.setPickEnabled(false);

    }

    undoLastPlay() {
        if (this.replay != true) {
            if (this.lastPlays.length != 0) {
                var lastPlay = this.lastPlays.pop();

                lastPlay.animation = null;
                lastPlay.final = null;
                lastPlay.played = false;

                if (this.player1turn) {
                    this.player2turn = true;
                    this.player1turn = false;
                }
                else {
                    this.player2turn = false;
                    this.player1turn = true;
                }
            }
        }
    }

    startGame() {
        this.scene.setPickEnabled(true);

        if (this.player1turn)
            this.info = "Player 1 turn";
        else if (this.player2turn)
            this.info = "Player 2 turn";

        this.lastTimePlayed = this.scene.deltaTime;

        /* Request da erro se for mal sucedido!
    
            FUNCIONA NÃO MEXER
            
            var request = `teste(${this.timeout})`;
    
            this.server.makeRequest(request, function(data) {
                var response = data.target.response;

                if(response != 'Bad Request')
                    console.log(response); 
            });
        */
    }

    quitGame() {
        this.board = new MyBoard(this.scene);
        this.planets = [];
        this.start = false;
        this.player1turn = true;
        this.player2turn = false;
        this.currPiece = null;
        this.currTile = null;
        this.lastPlays = [];
        this.replay = false;
        this.animations = [];
        this.animsAdded = false;
        this.scene.setPickEnabled(false);

        this.graph.shuffle(this.textures);

        for (var planet = 0; planet < 26; planet++) {
            var id = planet + 1486;
            var initial = vec3.fromValues(-2, 0.1, (planet % 7) - 3);
            var obj = new MyPlanet(this.scene, id, this.textures[planet], false, initial, null, null);

            this.planets.push(obj);
        }

        this.info = "Start a game";
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
            if (this.lastPlays.length < this.planets.length) {
                var previous = this.info;
                this.info = "Game is still in course! \n" + previous;
            }

            else {

                this.replay = true;

                for (var j = 0; j < this.lastPlays.length; j++) {

                    this.animations.push(this.lastPlays[j].animation);
                    this.lastPlays[j].animation = null;
                    console.log(this.animations.length);
                }
            }
        }
    }

    display() {
        document.getElementById("info").innerText = this.info;
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

        if (this.lastPlays.length == this.planets.length) {
            this.info = "The game has ended!\nTODO: CHECK WINNER";
            this.scene.setPickEnabled(false);
        }

        if ((this.timeout * 1000 + this.lastTimePlayed) < this.scene.deltaTime) {
            if (this.player1turn) {
                this.player2turn = true;
                this.player1turn = false;
                this.info = "Player 2 turn";
            }
            else if (this.player2turn) {
                this.player1turn = true;
                this.player2turn = false;
                this.info = "Player 1 turn";
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

    isValidMove(position) {
        //prolog function: valid_move(coord(X, Y), Board).

        var board;
        var x;
        var y;

        if (this.player2turn) {
            board = this.boardP1;
            x = 27 - position[2];
            y = position[0];
        }
        else if (this.player1turn) {
            board=this.boardP2;
            x = 0 - position[2] - 1;
            y = position[0];
        }

        console.log(x + " " + y);


        var request = `testMove(${x},${y},${board})`;

        this.server.makeRequest(request, function (data) {
            var response = data.target.response;

            if (response != 'Bad Request')
                return true;
            else
                return false;
        });

        return true;
    }

    processPicking() {
        if (this.scene.pickMode == false) {
            if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
                for (var i = 0; i < this.scene.pickResults.length; i++) {

                    var obj = this.scene.pickResults[i][0];
                    if (obj) {
                        var customId = this.scene.pickResults[i][1];
                        console.log("Picked object: " + obj + ", with pick id " + customId);

                        if (this.piece == null) {
                            if (customId < 1486)
                                console.log("Escolher peça a mover em primeiro lugar!");
                            else {
                                if (obj.played == true)
                                    console.log("Peça já jogada!");
                                else {
                                    this.piece = obj;
                                    console.log("Escolheu a peça com o id " + this.piece.id);
                                }
                            }
                        }
                        else {
                            if (customId > 1485) {
                                this.piece = obj;
                                console.log("Escolheu a peça com o id " + this.piece.id);
                            }
                            else {
                                if ((customId >= 1 & customId <= 756) & this.player1turn) {
                                    this.tile = obj;
                                    this.player1turn = false;
                                    this.player2turn = true;
                                    console.log("Escolheu o local com o id " + this.tile.id);
                                    this.lastTimePlayed = this.scene.deltaTime;
                                    this.info = "Player 2 turn";
                                }
                                else if ((customId >= 757 & customId <= 1485) & this.player2turn) {
                                    this.tile = obj;
                                    this.player1turn = true;
                                    this.player2turn = false;
                                    console.log("Escolheu o local com o id " + this.tile.id);

                                    this.lastTimePlayed = this.scene.deltaTime;
                                    this.info = "Player 1 turn";
                                }
                                else {
                                    this.piece = null;
                                    console.log("Wrong player!");
                                }

                            }
                        }

                        if (this.piece != null & this.tile != null) {

                            if (this.isValidMove(this.tile.position)) {
                                this.piece.final = this.tile.position;

                                var keyframes = [];

                                var keyFrameTransfs = [];
                                keyFrameTransfs.push(...[this.piece.initial, vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)]);
                                var keyf = new Keyframe(this.graph, this.scene.deltaTime / 1000, keyFrameTransfs);
                                keyframes.push(keyf);

                                var keyFrameTransfs = [];
                                keyFrameTransfs.push(...[vec3.fromValues(this.piece.final[0] / 2, 3, this.piece.final[2] / 2), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)]);
                                var keyf = new Keyframe(this.graph, this.scene.deltaTime / 1000 + 1, keyFrameTransfs);
                                keyframes.push(keyf);

                                var keyFrameTransfs = [];
                                keyFrameTransfs.push(...[vec3.fromValues(this.piece.final[0], 0.15, this.piece.final[2]), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)]);
                                var keyf = new Keyframe(this.graph, this.scene.deltaTime / 1000 + 2, keyFrameTransfs);
                                keyframes.push(keyf);

                                var keyFrameAnim = new KeyframeAnimation(customId, this.scene, keyframes);
                                this.piece.animation = keyFrameAnim;

                                this.piece.played = true;

                                this.lastPlays.push(this.piece);

                                this.piece = null;
                                this.tile = null;
                            }
                        }
                    }
                }
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
            }
        }
    }
};