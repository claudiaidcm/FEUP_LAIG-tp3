/**
 * MyTile
 * @constructor
 * @param {XMLScene} scene - reference to MyScene object
 */

class MyTile extends CGFobject {
    constructor(scene, id, position) {
        super(scene);
        this.scene = scene;
        this.id = id;
        this.position = position;
        this.tile = new MyPlane(this.scene, 1, 1);
    };

    display() {
        this.tile.display();
    };
};