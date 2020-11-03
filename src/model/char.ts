import * as THREE from "three";
import anime from "animejs";

class option {
  color?: string;
  alpha?: number;
}
export class Char {
  mesh: THREE.Mesh;
  _canvas: HTMLCanvasElement;
  _context: CanvasRenderingContext2D;
  _texture: THREE.Texture;
  _mat: THREE.MeshBasicMaterial;

  constructor(size: number = 10) {
    this.init(size);
  }
  init(size: number) {
    this._canvas = document.createElement("canvas");
    this._context = this._canvas.getContext("2d");
    this._texture = new THREE.CanvasTexture(this._canvas);
    this._mat = new THREE.MeshBasicMaterial({
      map: this._texture,
      transparent: true,
      side: THREE.DoubleSide,
    });
    this._mat.needsUpdate = true;
    this.mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(size, size),
      this._mat
    );
    (this.mesh.material as THREE.Material).needsUpdate = true;

    this._canvas.width = 512;
    this._canvas.height = 512;
    this._texture.needsUpdate = true;
  }
  drawText(text: string, size: number, option: option) {
    const can = this._canvas;
    const ctx = this._context;
    ctx.clearRect(0, 0, can.width, can.height);
    ctx.fillStyle = "rgba(0,128,128)";
    ctx.globalAlpha = option.alpha ? option.alpha : 0.8;
    ctx.textAlign = "center";
    ctx.fillStyle = option.color ? option.color : "#000000";
    ctx.font = "bold " + size + "px sans-serif";

    ctx.fillText(text, can.width / 2, can.height / 2 + size / 2 - 20);
    (this.mesh.material as THREE.MeshBasicMaterial).map.needsUpdate = true;
  }
  clearText() {
    const can = this._canvas;
    const ctx = this._context;
    ctx.clearRect(0, 0, can.width, can.height);
  }
  drawEaseText(text: string, duration: number, size: number) {
    this.clearText();

    const str = {
      size: size,
    };
    anime({
      targets: str,
      size: 250,
      duration: duration + 800,
      easing: "easeOutBack",
      update: (anim) => {
        const tar = anim.animatables[0] as any;
        this.drawText(text, tar.target.size, {});
      },
      complete: () => this.outText(text),
    });
  }
  outText(text: string) {
    const str = {
      size: 250,
      alpha: 0.8,
    };
    anime({
      targets: str,
      size: 0,
      alpha: 0,
      duration: 800,
      easing: "easeInBack",
      update: (anim) => {
        const tar = anim.animatables[0] as any;
        this.drawText(text, tar.target.size, { alpha: tar.target.alpha });
      },
      complete: () => this.clearText(),
    });
  }
}
