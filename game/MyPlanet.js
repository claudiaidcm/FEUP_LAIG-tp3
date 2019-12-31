/**
 * MyPlanet
 * @constructor
 * @param {XMLScene} scene - reference to MyScene object
 */

class MyPlanet extends CGFobject {
    constructor(scene, id, played, initial, final, animation) {
        super(scene);
        this.scene = scene;
        this.id = id;
        this.played = played;
        this.initial = initial;
        this.final = final;
        this.animation = animation;
        this.planet = new MyPlane(this.scene, 1, 1);
    };

    display() {
        this.planet.display();
    };
};