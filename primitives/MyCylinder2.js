/**
 * MyCylinder2
 * @constructor
 * @param {XMLScene} scene - reference to MyScene object
 * @param {number} base - radius of the base (z=0)
 * @param {number} top - radius of the top (z=height)
 * @param {number} height - size in the direction of the positive z axis
 * @param {number} slices - number of divisions around the circumference
 * @param {number} stacks - number of divisions along the z direction
 */

class MyCylinder2 extends CGFobject {
  constructor(scene, height, base, top, slices, stacks) {
    super(scene);
    this.height = height;
    this.base = base;
    this.top = top;
    this.slices = slices;
    this.stacks = stacks;
    this.init();
  };

  init() {
    //pontos para 1/4 do cilindro
    this.controlvertexes = [
      [
        [0, this.top, this.height, 1],
        [0, this.base, 0, 1]
      ],
      [
        [this.top, this.top, this.height, 1],
        [this.base, this.base, 0, 1]
      ],
      [
        [this.top, 0, this.height, 1],
        [this.base, 0, 0, 1]
      ]
    ];

    this.nurbsSurface = new CGFnurbsSurface(2, 1, this.controlvertexes);
    this.obj = new CGFnurbsObject(this.scene, Math.round(this.slices/4), Math.round(this.stacks/4), this.nurbsSurface);
  };

  display() {
    //display da surface 4 vezes pra fazer o cilindro completo
    this.obj.display();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI / 2, 0, 0, 1);
    this.obj.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0, 0, 1);
    this.obj.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI / 2, 0, 0, 1);
    this.obj.display();
    this.scene.popMatrix();
  };
};
