import { IChar } from "textalive-app-api";
import * as THREE from "three";
import { Box } from "./box";
import anime from "animejs";

export class RotateBox {
  mesh: THREE.Object3D;
  _obj: Box[] = [];
  _currentId = -1;
  inProgress = false;
  constructor() {
    this.init();
  }
  init() {
    const radius = 30;
    this.mesh = new THREE.Object3D();
    let h = -80;
    for (let n = 0; n < 18; n++) {
      const b = new Box(1, 1);
      b.mesh.position.z = 200;
      this.mesh.add(b.mesh);
      this._obj.push(b);
    }
  }

  updateRotate() {
    this.mesh.rotation.z += Math.PI / 300;
    this.mesh.children
      .filter((v) => v.position.z < 100)
      .forEach((box) => {
        box.rotation.x += Math.PI / 100;
        box.rotation.y += Math.PI / 80;
      });
  }
  getNextAnimeBox(nth = 18) {
    if (this._currentId === -1) this._currentId = 0;
    const box = this._obj[this._currentId];
    this._currentId = (this._currentId + 1) % nth;
    return box;
  }
  drawTornadoChar(char: IChar) {
    if (!char.endTime) {
      return;
    }
    const box = this.getNextAnimeBox();

    box.mesh.position.x = 0;
    box.mesh.position.y = 0;
    box.mesh.position.z = -200;
    box.mesh.rotation.x = 0;
    box.mesh.rotation.y = 0;
    const tl = anime.timeline();
    tl.add({
      targets: box.mesh.position,
      z: 20,
      x: 30 * Math.cos((Math.PI * 2 * this._currentId) / 9),
      y: 30 * Math.sin((Math.PI * 2 * this._currentId) / 9),
      duration: 2000,
      easing: "easeOutCirc",
      complete: () => box.addChar(char),
    }).add({
      targets: box.mesh.position,
      z: 110,
      duration: 1000 + char.endTime - char.startTime,
      easing: "easeInCirc",
    });
  }
  // rotate in-------------------------------------------
  drawRotateInChar(char: IChar) {
    this.inProgress = true;
    const box = this.getNextAnimeBox();
    box.mesh.position.x = 100 * Math.cos((Math.PI * 2 * this._currentId) / 9);
    box.mesh.position.y = 100 * Math.sin((Math.PI * 2 * this._currentId) / 9);
    box.mesh.position.z = 0;
    box.mesh.rotation.x = 0;
    box.mesh.rotation.y = 0;
    const tl = anime.timeline();
    tl.add({
      targets: box.mesh.position,
      x: 30 * Math.cos((Math.PI * 2 * this._currentId) / 9),
      y: 30 * Math.sin((Math.PI * 2 * this._currentId) / 9),
      duration: 2000,
      easing: "easeOutCirc",
      complete: () => box.addChar(char),
    }).add(
      {
        targets: box.mesh.position,
        z: -600,
        x: 0,
        y: 0,
        duration: 1000,
        easing: "easeInCirc",
        complete: () => {
          const p = char.parent.parent;
          const w = p.children[p.children.length - 1];
          const last = w.children[w.children.length - 1];
          // Phrase time too short
          if (last.startTime === char.startTime && char.text === "で") {
            this.inProgress = false;
          }
        },
      },
      `+=${char.endTime - char.startTime}`
    );
  }
}
