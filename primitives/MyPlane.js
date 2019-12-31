/**
 * MyPlane
 * @constructor
 * @param {XMLScene} scene - reference to MyScene object
 * @param {number} npartsU - division in parts in the U domain
 * @param {number} npartsV - division in parts in the V domain
 */

class MyPlane extends CGFobject {
  constructor(scene, npartsU, npartsV) {
    super(scene);
    this.npartsU = npartsU;
    this.npartsV = npartsV;
    this.init();
  };

  init() {
    this.controlvertexes = [ // U = 0
      [ // V = 0..1;
        [-0.5, 0, 0.5, 1],
        [-0.5, 0, -0.5, 1]
      ],
      // U = 1
      [ // V = 0..1
        [0.5, 0, 0.5, 1],
        [0.5, 0, -0.5, 1]
      ]
    ];

    this.nurbsSurface = new CGFnurbsSurface(1, 1, this.controlvertexes);
    this.obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, this.nurbsSurface);
  };

  display() {
    this.obj.display();
  };
};
