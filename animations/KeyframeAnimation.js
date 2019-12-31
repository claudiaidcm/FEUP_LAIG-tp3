/**
 * KeyframeAnimation
 * @constructor
 * @param {string} id - id of the animation
 * @param {XMLScene} scene - reference to MyScene object
 * @param {array} keyframes - array with all the keyframes if the aniamtion
 */

var DEGREE_TO_RAD = Math.PI / 180;

class KeyframeAnimation extends Animation {
  constructor(id, scene, keyframes) {
    super(scene);
    this.id = id;
    this.scene = scene;
    this.keyframes = keyframes;
    this.transVecApp;
    this.rotVecApp;
    this.scaVecApp;
    this.maxTime = this.keyframes[this.keyframes.length - 1].instant;
  };

  update(currentTime) {
    if ((currentTime / 1000) > this.maxTime)
      return;

    var animMatrixIndex = this.checkPositionInAnim(currentTime / 1000); //get index of animMatrix
    var keyFrameF = this.keyframes[animMatrixIndex].keyFrameTransfs;
    var instantF = this.keyframes[animMatrixIndex].instant;
    var keyFrameI = [];
    var instantI;
    var deltaTime; //interval of time in which the animation should occur

    // sets deltaTime and animMatrixI depending on each animation we are in
    if (animMatrixIndex > 0) {
      instantI = this.keyframes[animMatrixIndex - 1].instant
      keyFrameI = this.keyframes[animMatrixIndex - 1].keyFrameTransfs;
    }
    else {
      instantI = 0;
      keyFrameI.push(...[vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)]);
    }

    // percentage of time passed interpolated between the initial keyframe and the final keyframe 
    var percentageTime = ((currentTime / 1000) - instantI) / (instantF - instantI);

    // TRANSLATE
    var transVecI = keyFrameI[0];
    var transVecF = keyFrameF[0];

    var trans_x = transVecI[0] + percentageTime * (transVecF[0] - transVecI[0]);
    var trans_y = transVecI[1] + percentageTime * (transVecF[1] - transVecI[1]);
    var trans_z = transVecI[2] + percentageTime * (transVecF[2] - transVecI[2]);

    this.transVecApp = vec3.fromValues(trans_x, trans_y, trans_z);


    // ROTATE
    var rotVecI = keyFrameI[1];
    var rotVecF = keyFrameF[1];

    var rot_x = rotVecI[0] + percentageTime * (rotVecF[0] - rotVecI[0]);
    var rot_y = rotVecI[1] + percentageTime * (rotVecF[1] - rotVecI[1]);
    var rot_z = rotVecI[2] + percentageTime * (rotVecF[2] - rotVecI[2]);

    this.rotVecApp = vec3.fromValues(rot_x, rot_y, rot_z);


    // SCALE
    var scaVecI = keyFrameI[2];
    var scaVecF = keyFrameF[2];

    var sca_x = scaVecI[0] + percentageTime * (scaVecF[0] - scaVecI[0]);
    var sca_y = scaVecI[1] + percentageTime * (scaVecF[1] - scaVecI[1]);
    var sca_z = scaVecI[2] + percentageTime * (scaVecF[2] - scaVecI[2]);

    this.scaVecApp = vec3.fromValues(sca_x, sca_y, sca_z);


  };

  apply() {
    this.matToApply = mat4.create();
    
    mat4.translate(this.matToApply, this.matToApply, this.transVecApp);

    mat4.rotateX(this.matToApply, this.matToApply, this.rotVecApp[0] * DEGREE_TO_RAD);
    mat4.rotateY(this.matToApply, this.matToApply, this.rotVecApp[1] * DEGREE_TO_RAD);
    mat4.rotateZ(this.matToApply, this.matToApply, this.rotVecApp[2] * DEGREE_TO_RAD);
        
    mat4.scale(this.matToApply, this.matToApply, this.scaVecApp);
    
    this.scene.multMatrix(this.matToApply);
  };

  checkPositionInAnim(time) {
    for (var i = 0; i < this.keyframes.length; i++) {
      if (time <= this.keyframes[i].instant)
        return i;
    }
  }
};
