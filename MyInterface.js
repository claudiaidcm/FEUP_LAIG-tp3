/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        this.aspect = this.gui.addFolder('Global aspect');
        this.gameSettings = this.gui.addFolder('Game settings');

        //Show or not axis control
        this.aspect.add(this.scene, 'displayAxis').name('Display Axis');

        //Scale factor
        this.aspect.add(this.scene, 'scaleFactor', 0.1, 5).name('Scale Factor');

        this.initKeys();

        return true;
    }

    //add lights to user interface
    addLights(lights) {
        var interLight = this.aspect.addFolder("Lights");

        //lightsInfo -> array in which each position identifier is the light ID 
        //  and it's value is true or false (light enabled or disabled)
        for (var key in lights) {
            this.scene.lightsInfo[key] = lights[key][0];
            interLight.add(this.scene.lightsInfo, key);
        }
    }


    //add cameras to user interface
    addCameras() {
        this.aspect.add(this.scene, 'cameraId', this.scene.viewIds).onChange(
            this.scene.updateCamera.bind(this.scene)).name('Camera');

    }

    addGameSettings() {
        this.gameSettings.add(this.scene, 'currentScene', ["classic", "galaxy"]).onChange(
            this.scene.changeTheme.bind(this.scene)).name('Theme');

        this.gameSettings.add(this.scene.graph.game, 'startGame').name("Start game");

        this.gameSettings.add(this.scene.graph.game, 'timeout', 5, 20).name("Set timeout");

        this.gameSettings.add(this.scene.graph.game, 'undoLastPlay').name("Undo last play");

        this.gameSettings.add(this.scene.graph.game, 'replayGame').name("Replay game");

        this.gameSettings.add(this.scene.graph.game, 'quitGame').name("Quit game");
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function () { };
        this.activeKeys = {};
    }

    processKeyDown(event) {
        this.activeKeys[event.code] = true;
        if (event.key == "m" || event.key == "M")
            this.scene.numMaterial++;
        this.activeKeys[event.code] = false;
    };

    processKeyUp(event) {
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }

}