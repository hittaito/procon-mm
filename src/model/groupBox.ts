import { IChar, IPhrase } from "textalive-app-api";
import * as THREE from "three";
import { Box } from "./box";
import anime from "animejs";

export class GroupBox {
  mesh: THREE.Object3D;
  _obj: Box[] = [];
  _currentId = -1;
  _phraseInfo: {
    duration: number;
    text: string;
    currentCharId: number;
  };
  constructor() {
    this.init();
  }
  init() {
    this.mesh = new THREE.Object3D();
    for (let n = 0; n < 18; n++) {
      const b = new Box(1, 1);
      b.mesh.position.z = 200;
      this.mesh.add(b.mesh);
      this._obj.push(b);
    }
  }

  getNextAnimeBox(nth = 18) {
    if (this._currentId === -1) this._currentId = 0;
    const box = this._obj[this._currentId];
    this._currentId = (this._currentId + 1) % nth;
    return box;
  }

  // side in (box move)---------------------------------------------------
  drawSideInChar(char: IChar) {
    const box = this.getNextAnimeBox();
    box.mesh.position.x = -300;
    const [id, l] = this.getCurrentCharId();
    box.mesh.position.y = 60 - (id % 5) * 15;
    box.mesh.position.z = 20;
    box.mesh.rotation.x = 0;
    box.mesh.rotation.y = 0;
    const x = Math.floor(id / 5);
    const tl = anime.timeline();
    tl.add({
      targets: box.mesh.position,
      duration: 2000,
      x: 10 - 20 * x,
      easing: "easeInQuad",
      complete: () => box.addChar(char),
    }).add(
      {
        targets: box.mesh.position,
        duration: 2000,
        x: 300,
        easing: "easeInQuint",
      },
      `+=${char.endTime - char.startTime + 800}`
    );
  }
  updatePhrase(phrase: IPhrase) {
    this._phraseInfo = {
      duration: phrase.endTime - phrase.startTime,
      text: phrase.text,
      currentCharId: -1,
    };
  }
  getCurrentCharId() {
    this._phraseInfo.currentCharId++;
    return [this._phraseInfo.currentCharId, this._phraseInfo.text.length];
  }
}
