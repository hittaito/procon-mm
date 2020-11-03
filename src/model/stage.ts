import * as THREE from "three";
import { Box } from "./box";
import { Char } from "./char";
import { Color } from "../const/colors";
import { IChar } from "textalive-app-api";
import anime from "animejs";

export class Stage {
  mesh: THREE.Object3D;
  numYBOX = 10;
  _boxes: Box[] = [];
  _maxX = 3;
  rad = -Math.PI / 2;
  lines = [];
  currentLine = 0;
  char: Char;
  _point = {
    x: -100,
    y: 100,
  };

  colorChanger = 0;
  colorPos = 0;
  constructor() {
    this.init();
  }
  init() {
    this.lines = [...Array(this.numYBOX)].map(() => 0);
    this.lines[5] = 200;
    this.mesh = new THREE.Object3D();
    this.resize();
    this.createBoxLine();
  }
  resize() {
    const ratio = window.innerWidth / window.innerHeight;
    if (ratio < 1) {
      this._maxX = 4;
    } else {
      this._maxX = Math.floor(ratio * 4) + 1;
    }
  }
  createBoxLine() {
    const obj = this.createBaseBox();
    for (let x = 0; x < this._maxX; x++) {
      for (let y = 0; y < this.numYBOX; y++) {
        const c = obj.clone();
        c.position.x = -50 - x * 50;
        c.position.y = 200 - y * 50;
        this.mesh.add(c);
      }
    }
    for (let y = 0; y < this.numYBOX; y++) {
      const c = obj.clone();
      c.position.y = 200 - y * 50;
      if (y !== 4) {
        this.mesh.add(c);
      }
    }
    for (let x = 0; x < this._maxX; x++) {
      for (let y = 0; y < this.numYBOX; y++) {
        const c = obj.clone();
        c.position.x = 50 + x * 50;
        c.position.y = 200 - y * 50;
        this.mesh.add(c);
      }
    }
    this.mesh.position.z = 60;
  }
  load = 0;
  onLoad() {
    this.load++;
    const l = Math.floor(this.load / 8);
    const r = (((l % 8) - 3) * Math.PI) / 4;

    this.mesh.children.forEach((b) => {
      if (
        b.position.x > 50 ||
        b.position.x < -50 ||
        b.position.y > 50 ||
        b.position.y < -50
      ) {
        this.off(b);
        return;
      }
      const theta = Math.atan2(b.position.y, b.position.x);
      if (theta === r) {
        this.on(b);
      } else {
        this.off(b);
      }
    });
  }
  done() {
    this.mesh.children.forEach((b) => this.off(b));
  }
  createBaseBox() {
    const obj = new THREE.Object3D();
    const geom = new THREE.BoxBufferGeometry(50, 50, 5);
    const edge = new THREE.EdgesGeometry(geom);
    const edgemat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const line = new THREE.LineSegments(edge, edgemat);

    const char = new Char(50);
    char.mesh.position.x = 0;
    char.mesh.position.y -= 0;
    char.mesh.position.z += 2.5;

    const box = new THREE.Object3D();

    Object.keys(Color).forEach((k) => {
      const gMat = new THREE.MeshBasicMaterial({
        color: Color[k],
        opacity: 0.7,
        transparent: true,
      });
      const b = new THREE.Mesh(geom, gMat);
      b.layers.disable(0);
      b.name = Color[k];
      box.add(b);
    });
    this.char = char;
    obj.add(line, char.mesh, box);

    obj.position.z -= 150;
    obj.children[2].children[5].layers.enable(0);
    return obj;
  }
  resetColor() {
    this.mesh.children.forEach((b) => {
      this.off(b);
    });
  }
  updateWave() {
    this.rad += 0.05;
    this.mesh.children.forEach((b, idx) => {
      const x = b.position.x + this._maxX * 50;
      const y = b.position.y;
      b.position.z = -150;
      const l = Math.sqrt(x * x + y * y);
      let rad = -this.rad + (Math.PI / 600) * l;
      if (rad > 0) rad = -Math.PI / 2;
      b.position.z = -120 + 30 * Math.sin(rad);
      if (b.position.z > -105) {
        this.on(b);
      }
    });
  }
  waveColor = 0;
  updateCircleWave(color = false) {
    if (this.inprogress) {
      return;
    }
    this.rad += 0.09;
    if (
      (this.rad - 0.09) % (2 * Math.PI) < (Math.PI * 3) / 2 &&
      this.rad % (2 * Math.PI) > (Math.PI * 3) / 2
    ) {
      this.waveColor = (this.waveColor + 1) % 5;
    }
    this.mesh.children.forEach((b, idx) => {
      const x = b.position.x;
      const y = b.position.y;
      b.position.z = -150;
      const l = Math.sqrt(x * x + y * y);
      let rad = -this.rad + (Math.PI / 300) * l;
      if (rad > 0) rad = -Math.PI / 2;
      b.position.z = -120 + 30 * Math.sin(rad);
      if (b.position.z > -100) {
        if (color) {
          this.on(b, this.waveColor);
        } else {
          this.on(b);
        }
      } else {
        this.off(b);
      }
    });
  }
  updateColorWave(color = false) {
    this.mesh.children.forEach((b, idx) => {
      if (b.position.z > -150) {
        b.position.z -= 1;
      }
    });

    this.lines = this.lines.map((v) => {
      if (v === 0) {
        return v;
      }
      v = v + 10;
      if (v > this._maxX * 50 * 2 + 50) v = 0;
      return v;
    });

    this.mesh.children.forEach((b) => {
      b.children[2].children.forEach((v) => {
        v.layers.disable(0);
      });
      const y = this.lines[Math.floor((b.position.y + 250) / 50)];
      if (y !== 0) {
        const pos = y - this._maxX * 50;
        if (b.position.x < pos && b.position.x > pos - 50) {
          if (color) {
            this.on(b, Math.floor((b.position.y + 250) / 50) % 5);
          } else {
            this.on(b);
          }
        } else {
          this.off(b);
        }
      } else {
        this.off(b);
      }
    });
  }
  setColor(y: number) {
    this.lines[this.numYBOX - this.currentLine] = 1;
    this.currentLine = (this.currentLine + 1) % this.numYBOX;
  }
  updateCircle(color = false) {
    this.rad += 0.05;
    this.colorChanger = (this.colorChanger + 1) % this.mesh.children.length;
    this.mesh.children.forEach((b, idx) => {
      const x = b.position.x;
      const y = b.position.y;
      const theta = Math.atan2(-y, x) + this.rad;
      const t = theta - Math.PI * 2 * Math.floor(theta / (Math.PI * 2));
      const l = Math.sqrt(x * x + y * y);
      const z = -110 + Math.sin(t) * Math.exp(-t) * l;
      if (z > -100) {
        if (color) {
          const c = Math.floor((theta + Math.PI * 2) / (Math.PI * 2)) % 5;
          this.on(b, c);
        } else {
          this.on(b);
        }
      } else {
        this.off(b);
      }
      if (b.position.z > -150) {
        b.position.z -= 1;
      }
    });
  }

  changeColor() {
    this.rad += 0.1;
    if (
      (this.rad - 0.1) % (2 * Math.PI) < (Math.PI * 3) / 2 &&
      this.rad % (2 * Math.PI) > (Math.PI * 3) / 2
    ) {
      this.waveColor = (this.waveColor + 1) % 5;
    }
    this.mesh.children.forEach((b) => {
      const x = b.position.x;
      const y = b.position.y + 200;
      const l = Math.sqrt(x * x + y * y);
      let rad = -this.rad + (Math.PI / 250) * l;
      if (rad > 0) rad = -Math.PI / 2;
      const z = -120 + 30 * Math.sin(rad);
      if (b.position.z - z > 3) {
        b.position.z -= 3;
      } else if (b.position.z - z < -3) {
        b.position.z += 3;
      } else {
        b.position.z = z;
      }

      if (z > -100) {
        this.on(b, this.waveColor);
      } else {
        this.off(b);
      }
    });
  }
  updateColor() {
    this.rad += 0.1;
    this.mesh.children.forEach((b) => {
      if (b.position.z === -150) {
        const x = b.position.x;
        const y = b.position.y + 200;
        const l = Math.sqrt(x * x + y * y);
        let rad = -this.rad + (Math.PI / 250) * l;
        if (rad > 0) rad = -Math.PI / 2;
        const z = -120 + 30 * Math.sin(rad);
        if (z > -100) {
          this.on(b, this.waveColor);
        } else {
          this.off(b);
        }
      }
    });
  }
  changeWaveColor() {
    setTimeout(() => (this.waveColor = (this.waveColor + 1) % 5), 2800);
  }
  inprogress = false;
  stageChar(c: IChar) {
    this.inprogress = true;
    const char = new Char(50);
    char.mesh.position.x = 0;
    char.mesh.position.y -= 0;
    char.mesh.position.z += 2.5;
    const box = this.selectBox();
    box.add(char.mesh);

    const tl = anime.timeline();
    tl.add({
      targets: box.position,
      z: -150,
      duration: 1500,
      complete: () => this.on(box),
    })
      .add({
        targets: box.position,
        duration: 500,
        z: -120,
        easing: "easeInQuad",
        complete: () => char.drawEaseText(c.text, -300, 250),
      })
      .add(
        {
          targets: box.position,
          duration: 1000,
          z: -150,
          easing: "easeInBack",
          complete: () => {
            const p = c.parent.parent;
            const w = p.children[p.children.length - 1];
            const last = w.children[w.children.length - 1];
            if (last.startTime === c.startTime) {
              this.inprogress = false;
            }
            this.off(box);
          },
        },
        `+=${c.endTime - c.startTime}`
      );
  }
  selectBox() {
    const b = this.mesh.children.find((m) => {
      if (m.position.x === this._point.x && m.position.y === this._point.y) {
        return true;
      } else {
        return false;
      }
    });
    this._point.x += 50;
    if (this._point.x > 100) {
      this._point.x = -100;
      this._point.y -= 50;
      if (this._point.y === 0) {
        this._point.y = -50;
      } else if (this._point.y === -150) {
        this._point.y = 100;
      }
    }
    return b;
  }
  resetPoint() {
    this.mesh.children.forEach((b) => {
      b.position.z = -150;
    });
    this._point = {
      x: -100,
      y: 100,
    };
  }
  finish() {
    this.mesh.children.forEach((b) => {
      if (b.position.z < -150) {
        this.off(b);
      } else {
        this.on(b, this.waveColor);
        b.position.z -= 1;
      }
    });
  }
  on(box: THREE.Object3D, id = 0) {
    box.children[2].children.forEach((c) => c.layers.disable(0));
    box.children[2].children[id].layers.enable(0);
  }
  off(box: THREE.Object3D) {
    box.children[2].children.forEach((c) => c.layers.disable(0));
    box.children[2].children[5].layers.enable(0);
  }
}
