/**
 * MyPatch
 * @constructor
 * @param {XMLScene} scene - represents the CGFscene
 * @param {number} npointsU - number of control points of the NURBS object in the u coordinate
 * @param {number} npointsV - number of points of the NURBS object in the v coordinate
 * @param {number} npartsU - division in parts in the U domain
 * @param {number} npartsV - division in parts in the V domain
 * @param {array} controlpoints - array of all the control points
 */

class MyPatch extends CGFobject {
  constructor(scene, npointsU, npointsV, npartsU, npartsV, controlpoints) {
    super(scene);
    this.npointsU = npointsU;
    this.npointsV = npointsV;
    this.npartsU = npartsU;
    this.npartsV = npartsV;
    this.controlpoints = controlpoints;
    this.controlvertexes = Array(npointsU).fill(null).map(()=>Array(npointsV).fill(null));
    this.init();
  };

  init() {
    for (var u = 0; u < this.npointsU; u++)
      for (var v = 0; v < this.npointsV; v++)
        this.controlvertexes[u][v] = [this.controlpoints[this.npointsV * u + v][0], this.controlpoints[this.npointsV * u + v][1], this.controlpoints[this.npointsV * u + v][2], 1];

    this.nurbsSurface = new CGFnurbsSurface(this.npointsU - 1, this.npointsV - 1, this.controlvertexes);
    this.obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, this.nurbsSurface);
  };

  display() {
    this.obj.display();
  };
};
