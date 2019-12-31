/**
  * MyGame class
  * @constructor
  * @param {XMLScene} scene - reference to MyScene object
  */

class MyGame extends CGFobject {
    constructor(scene, graph, textures) {
        super(scene);
        this.scene = scene;
        this.graph = graph;
        this.textures = textures;
        this.board = new MyBoard(this.scene);
        this.planets = [];
        this.player1turn = true;
        this.player2turn = false;
        this.currPiece = null;
        this.currTile = null;
        this.lastPlays = [];

        for (var planet = 0; planet < 27; planet++) {
            var id = planet + 1486;
            var initial = vec3.fromValues(-2, 0.1, (planet % 7) - 3);
            var obj = new MyPlanet(this.scene, id, false, initial, null, null);

            this.planets.push(obj);
        }
    }

    undoLastPlay() {
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

    display() {
        this.scene.pushMatrix();
        this.board.display();
        this.scene.popMatrix();

        this.whiteTile = new CGFappearance(this.scene);
        this.whiteTile.setAmbient(1, 1, 1, 1);
        this.whiteTile.setDiffuse(1, 1, 1, 1);
        this.whiteTile.setSpecular(1, 1, 1, 1);
        this.whiteTile.setEmission(0, 0, 0, 1);

        for (var j = 0; j < 26; j++) {
            this.scene.pushMatrix();
            this.whiteTile.setTexture(this.textures[j]);
            this.whiteTile.apply();

            if (this.planets[j].animation != null) {
                if (this.scene.deltaTime / 1000 < this.planets[j].animation.keyframes[this.planets[j].animation.keyframes.length - 1].instant)
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
                                }
                                else if ((customId >= 784 & customId <= 1485) & this.player2turn) {
                                    this.tile = obj;
                                    this.player1turn = true;
                                    this.player2turn = false;
                                    console.log("Escolheu o local com o id " + this.tile.id);
                                }
                                else {
                                    this.piece = null;
                                    console.log("Wrong player!");
                                }

                            }
                        }

                        if (this.piece != null & this.tile != null) {
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

                            console.log(this.lastPlays);

                            this.piece = null;
                            this.tile = null;
                        }
                    }
                }
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
            }
        }
    }
};