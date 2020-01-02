var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;

        this.displayAxis = true;
        this.scaleFactor = 1;

        this.numMaterial = 0;

        this.lightsInfo = {};
        this.camera;

        this.lastTime = -1;
        this.deltaTime;
        this.firstTime = 0;

        this.animation = null;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCamera();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(100);

    }

    initCamera() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        //Choose the camera with the appropriate default ID in case it exists.
        this.viewIds = [];
        this.cameras = [];

        for (var key in this.graph.views) {
            var view = this.graph.views[key];
            if (view[0] == "perspective")
                this.cameras[key] = new CGFcamera(view[1], view[2], view[3], view[4], view[5]);
            else if (view[0] == "ortho")
                this.cameras[key] = new CGFcameraOrtho(view[1], view[2], view[3], view[4], view[5], view[6], view[7], view[8], view[9]);

            this.viewIds.push(key);

            if (key == this.graph.defaultView) {
                this.cameraId = key;
                this.secCameraId = key;
            }
        }

        this.camera = this.cameras[this.cameraId];
        this.interface.setActiveCamera(this.camera);
    }

    updateCamera() {
        this.animation = new CameraRotation(this, this.camera, this.cameras[this.cameraId]);
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);
                this.lights[i].setConstantAttenuation(light[6][0]);
                this.lights[i].setLinearAttenuation(light[6][1]);
                this.lights[i].setQuadraticAttenuation(light[6][2]);

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[7]);
                    this.lights[i].setSpotExponent(light[8]);
                    this.lights[i].setSpotDirection(light[9][0], light[9][1], light[9][2]);
                }

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    update(currentTime) {
        if (this.firstTime == 0)
            this.firstTime = currentTime;

        if (this.lastTime == -1)
            this.deltaTime = 0;
        else
            this.deltaTime = currentTime - this.firstTime;

        for (var key in this.graph.animations) {
            this.graph.animations[key].update(this.deltaTime);
        }

        if (this.sceneInited) {
            for (var j = 0; j < this.graph.game.planets.length; j++) {
                if (this.graph.game != null)
                    if (this.graph.game.planets[j].animation != null)
                        this.graph.game.planets[j].animation.update(this.deltaTime);
            }
        }

        if (this.animation != null)
            this.animation.apply();

        this.lastTime = currentTime;
    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.2, 0.8, 1.0);
        this.setDiffuse(0.2, 0.2, 0.8, 1.0);
        this.setSpecular(0.2, 0.2, 0.8, 1.0);
        this.setShininess(10.0);
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);
        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.initCameras();
        this.interface.addCameras(this.graph.views);

        this.initLights();
        this.interface.addLights(this.graph.lights);

        this.sceneInited = true;

        this.currentScene = this.graph.filename.slice(0, -4);
        this.interface.addGameSettings();
    }

    /**
     * Displays the scene.
     */
    display() {
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();


        if (this.displayAxis)
            this.axis.display();

        //goes trough all the lights and enables the ones that are selected
        var i = 0;
        for (var key in this.lightsInfo) {
            //if light is selected
            if (this.lightsInfo[key]) {
                this.lights[i].setVisible(true);
                this.lights[i].enable();
            }
            //if light is not selected
            else {
                this.lights[i].setVisible(false);
                this.lights[i].disable();
            }
            this.lights[i].update();
            i++;
        }

        this.pushMatrix();

        var sca = [this.scaleFactor, 0.0, 0.0, 0.0,
            0.0, this.scaleFactor, 0.0, 0.0,
            0.0, 0.0, this.scaleFactor, 0.0,
            0.0, 0.0, 0.0, 1.0];
        this.multMatrix(sca);


        if (this.sceneInited) {
            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    changeTheme(filename) {
        this.graph.changeTheme = true;
        this.graph.reader.open('scenes/' + filename + '.xml', this.graph);
    }
}