import * as THREE from "three";
import { Stage } from "../model/stage";
import { IChar, IPhrase } from "textalive-app-api";
import { GroupBox } from "../model/groupBox";
// import Stats from "three/examples/jsm/libs/stats.module";
import { RotateBox } from "../model/rotateBox";

export class ThreeController {
  private static instance: ThreeController;
  static getInstance() {
    if (!ThreeController.instance) {
      ThreeController.instance = new ThreeController();
    }
    return ThreeController.instance;
  }
  _width: number;
  _height: number;

  _scene: THREE.Scene;
  _camera: THREE.PerspectiveCamera;
  _renderer: THREE.WebGLRenderer;
  _container: HTMLDivElement;

  _box: GroupBox;
  _rotBox: RotateBox;
  _stage: Stage;

  animationType:
    | "loading"
    | "done"
    | "rotate"
    | "boxMove"
    | "cBoxMove"
    | "tornado"
    | "cTornado"
    | "stream"
    | "pause1"
    | "pause2"
    | "pause3"
    | "pause4"
    | "finish"
    | "color" = "loading";
  // stats: any;
  private constructor() {
    this.init();
  }

  init() {
    // this.stats = Stats();
    // this.stats.showPanel(0);
    // document.body.appendChild(this.stats.dom);

    this._width = window.innerWidth;
    this._height = window.innerHeight;

    this._scene = new THREE.Scene();
    this._scene.fog = new THREE.Fog(0x000000, 1, 600);

    this._camera = new THREE.PerspectiveCamera(
      90,
      this._width / this._height,
      1,
      800
    );
    this._camera.position.y = 0;
    this._camera.position.z = 0;
    this._camera.layers.enable(1);

    this._renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true });
    this._renderer.setSize(this._width, this._height);
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.shadowMap.enabled = true;

    this._container = document.getElementById("container") as HTMLDivElement;
    this._container.appendChild(this._renderer.domElement);

    this.createBox();
    this.createRotBox();
    this.createStage();

    this.loop();
  }
  updateChar(char: IChar) {
    switch (this.animationType) {
      case "rotate":
        this._rotBox.drawRotateInChar(char);
        break;
      case "boxMove":
      case "cBoxMove":
        this._box.mesh.rotation.z = 0;
        this._box.drawSideInChar(char);
        this._stage.setColor(1);
        break;
      case "tornado":
        this._rotBox.drawTornadoChar(char);
        break;
      case "cTornado":
        this._rotBox.drawTornadoChar(char);
        break;
      case "stream":
        this._stage.stageChar(char);
        break;
      case "color":
        this._stage.changeWaveColor();
        this._stage.stageChar(char);
    }
  }
  updatePhraseAnime(phrase: IPhrase) {
    if (this.animationType === "boxMove" || this.animationType === "cBoxMove") {
      this._box.updatePhrase(phrase);
    }
  }
  loop() {
    // this.stats.begin();
    this.loopStage();
    this._rotBox.updateRotate();
    this._renderer.render(this._scene, this._camera);
    // this.stats.end();
    requestAnimationFrame(() => this.loop());
  }
  loopStage() {
    switch (this.animationType) {
      case "loading":
        this._stage.onLoad();
        break;
      case "done":
        this._stage.done();
        break;
      case "rotate":
      case "tornado":
        this._stage.updateCircle();
        break;
      case "cTornado":
        this._stage.updateCircle(true);
        break;
      case "boxMove":
        this._stage.updateColorWave();
        break;
      case "cBoxMove":
        this._stage.updateColorWave(true);
        break;
      case "color":
        this._stage.updateColor();
        break;
      case "pause1":
        if (!this._rotBox.inProgress) {
          this._stage.updateWave();
        }
        break;
      case "pause2":
        this._stage.updateCircleWave();
        break;
      case "pause3":
        this._stage.updateCircleWave(true);
        break;
      case "pause4":
        this._stage.changeColor();
        break;
      case "finish":
        this._stage.finish();
    }
  }
  setStage() {
    if (this.animationType === "pause1") {
      this._stage.resetColor();
    } else if (
      this.animationType === "stream" ||
      this.animationType === "color"
    ) {
      this._stage.resetColor();
      this._stage.resetPoint();
    }
  }
  createBox() {
    this._box = new GroupBox();
    this._box.mesh.position.z -= 100;
    this._scene.add(this._box.mesh);
  }
  createRotBox() {
    this._rotBox = new RotateBox();
    this._rotBox.mesh.position.z -= 100;
    this._scene.add(this._rotBox.mesh);
  }

  createStage() {
    this._stage = new Stage();
    this._stage.mesh.position.z -= 150;
    this._scene.add(this._stage.mesh);
  }
  resize() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    this._camera.aspect = w / h;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize(w, h);
  }
}
