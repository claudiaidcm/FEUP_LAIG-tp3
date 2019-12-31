/**
  * MyBoard class
  * @constructor
  * @param {XMLScene} scene - reference to MyScene object
  */

class MyBoard extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;

        this.whiteTile = new CGFappearance(this.scene);
        this.whiteTile.setAmbient(1, 1, 1, 1);
        this.whiteTile.setDiffuse(1, 1, 1, 1);
        this.whiteTile.setSpecular(1, 1, 1, 1);
        this.whiteTile.setEmission(0, 0, 0, 1);

        this.greyTile = new CGFappearance(this.scene);
        this.greyTile.setAmbient(0.75, 0.75, 0.75, 0);
        this.greyTile.setDiffuse(0.75, 0.75, 0.75, 0);
        this.greyTile.setSpecular(0.75, 0.75, 0.75, 0);
        this.greyTile.setEmission(0, 0, 0, 1);

        this.tiles = [];

        for (var i = 0; i < 27; i++) {
            for (var j = 0; j < 55; j++) {
                if ((i != 13 || j != 13) & (i != 13 || j != 41) & j != 28) {
                    var id = 27 * j + i + 1;
                    var position = vec3.fromValues(i, 0.1, 28 - j);
                    var obj = new MyTile(this.scene, id, position);

                    this.tiles.push(obj);
                }
            }
        }
    };

    display() {
        for (var k = 0; k < this.tiles.length; k++) {
            this.scene.pushMatrix();

            var material;
            
            if (this.tiles[k].id % 2 == 0)
                material = this.whiteTile;
            else
                material = this.greyTile;

            material.apply();

            this.scene.translate(this.tiles[k].position[0], this.tiles[k].position[1], this.tiles[k].position[2]);
            this.scene.registerForPick(this.tiles[k].id, this.tiles[k]);
            this.tiles[k].display();
            this.scene.clearPickRegistration();
            this.scene.popMatrix();
        }
    }
};

