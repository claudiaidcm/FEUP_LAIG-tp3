/**
* CameraAnimation class, which represents a KeyFrame Animation
* @constructor
* @param {XMLScene} scene - reference to MyScene object
*/

class CameraRotation {
    constructor(scene, currCamera, nextCamera) {
        this.scene = scene;

        this.currCamera = currCamera;
        this.nextCamera = nextCamera;

        this.rotTime = (this.scene.deltaTime/1000) + 1;
    }

    apply() {

        if (this.rotTime < (this.scene.deltaTime/1000)) {
            this.scene.camera = this.nextCamera;
            this.scene.interface.setActiveCamera(this.camera);
            return;
        }

        var percentageTime = (this.rotTime - (this.scene.deltaTime/1000)) / this.rotTime;

        var near = this.form(this.nextCamera.near, this.currCamera.near, percentageTime);
        var far = this.form(this.nextCamera.far, this.currCamera.far, percentageTime);
        var fov = this.form(this.nextCamera.fov, this.currCamera.fov, percentageTime);

        var posX = this.form(this.nextCamera.position[0], this.currCamera.position[0], percentageTime);
        var posY = this.form(this.nextCamera.position[1], this.currCamera.position[1], percentageTime);
        var posZ = this.form(this.nextCamera.position[2], this.currCamera.position[2], percentageTime);
        var position = vec3.fromValues(posX, posY, posZ);

        var targX = this.form(this.nextCamera.target[0], this.currCamera.target[0], percentageTime);
        var targY = this.form(this.nextCamera.target[1], this.currCamera.target[1], percentageTime);
        var targZ = this.form(this.nextCamera.target[2], this.currCamera.target[2], percentageTime);
        var target = vec3.fromValues(targX, targY, targZ);

        this.scene.camera = new CGFcamera(fov, near, far, position, target);
        this.scene.interface.setActiveCamera(this.camera);
    }

    form(v0, v1, t) {
        return v0 + t * (v1 - v0);
    }

}