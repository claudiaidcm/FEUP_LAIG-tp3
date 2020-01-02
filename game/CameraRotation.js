  /**
 * CameraAnimation class, which represents a KeyFrame Animation
 */
class CameraAnimation {

    /**
     * @constructor
     * @param {XMLScene} scene      represents the CGFscene
     * @param {string}   id         Animation Id
     */
    constructor(scene, firstCamera, secondCamera, lengthOfTime) {
        this.scene = scene;
        this.positionFirstCamera = firstCamera.position;
        this.targetFirstCamera = firstCamera.target;
        this.directionFirstCamera = firstCamera.direction;
        this.nearFirstCamera = firstCamera.near;
        this.farFirstCamera = firstCamera.far;
        this.angleFirstCamera = firstCamera.fov;

        this.positionSecondCamera = secondCamera.position;
        this.targetSecondCamera = secondCamera.target;
        this.directionSecondCamera = secondCamera.direction;
        this.nearSecondCamera = secondCamera.near;
        this.farSecondCamera = secondCamera.far;
        this.angleSecondCamera = secondCamera.fov;

        this.lengthOfTime = lengthOfTime;
    }

    apply(deltaTime) {

        this.timeElapsed = deltaTime/1000;

        if (this.endOfAnimation) {
            return;

        }

        if (this.lengthOfTime < this.timeElapsed) {
            this.endOfAnimation = true;


            this.setCamera(this.angleSecondCamera, this.nearSecondCamera, this.farSecondCamera, this.positionSecondCamera, this.targetSecondCamera);

            return;
        }

        var percentageTime = (this.lengthOfTime - this.timeElapsed) / this.lengthOfTime;

        let newPositionX = this.lerp(this.positionSecondCamera[0], this.positionFirstCamera[0], percentageTime);
        let newPositionY = this.lerp(this.positionSecondCamera[1], this.positionFirstCamera[1], percentageTime);
        let newPositionZ = this.lerp(this.positionSecondCamera[2], this.positionFirstCamera[2], percentageTime);

        let newTargetX = this.lerp(this.targetSecondCamera[0], this.targetFirstCamera[0], percentageTime);
        let newTargetY = this.lerp(this.targetSecondCamera[1], this.targetFirstCamera[1], percentageTime);
        let newTargetZ = this.lerp(this.targetSecondCamera[2], this.targetFirstCamera[2], percentageTime);

        let near = this.lerp(this.nearSecondCamera, this.nearFirstCamera, percentageTime);
        let far = this.lerp(this.farSecondCamera, this.farFirstCamera, percentageTime);
        let fov = this.lerp(this.angleSecondCamera, this.angleFirstCamera, percentageTime);

        this.setCamera(fov, near, far, vec3.fromValues(newPositionX, newPositionY, newPositionZ), vec3.fromValues(newTargetX, newTargetY, newTargetZ));

    }

    setCamera(fov, near, far, position, target) {
        this.scene.camera = new CGFcamera(fov, near, far, position, target)
        this.scene.interface.setActiveCamera(this.camera);
        this.scene.newCamera = this.scene.camera;
    }


    lerp(v0, v1, t) {

        return v0 + t * (v1 - v0);

    }

}