/**
  * MyComponent class
  * @constructor
  * @param {string} id - id of the component
  * @param {XMLScene} graph - reference to MyScene object
  */

class MyComponent {
    constructor(graph, id) {
        this.graph = graph;
        this.id = id;
        this.transformationref;
        this.transformation = mat4.create();
        mat4.identity(this.transformation);
        this.animation;
        this.materials = [];
        this.texture;
        this.length_s = 1;
        this.length_t = 1;
        this.children = [];
        this.primitives = [];
    };

    /**
    * Adds a child to the chidlren array
    */
    addChild(id) {
        this.children.push(id);
    };

    addPrimitive(id) {
        this.primitives.push(id);
    };

};
