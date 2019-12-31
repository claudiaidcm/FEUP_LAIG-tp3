/**
 * Keyframe
 * @constructor
 * @param {XMLScene} scene - reference to MyScene object
 * @param {number} instant - time in seconds
 * @param {vec3} keyFrameTransfs - vector representing the 3 transsformations of the key frame
 */

class Keyframe {
  constructor(scene, instant, keyFrameTransfs) {
    this.scene = scene;
    this.instant = instant;
    this.keyFrameTransfs = keyFrameTransfs;
  };
}
