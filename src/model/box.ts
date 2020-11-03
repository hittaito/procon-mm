import { IChar } from "textalive-app-api";
import * as THREE from "three";
import { Char } from "./char";

export class Box {
  mesh: THREE.Object3D;

  _box: THREE.Mesh<THREE.BoxBufferGeometry, THREE.MeshBasicMaterial>;
  _char: Char;
  constructor(width: number, height: number) {
    this.init(width, height);
  }
  init(width = 10, height = 1) {
    this.mesh = new THREE.Object3D();
    const m = this.create(width, height);
    this.mesh.add(m);
  }
  create(width: number, height: number) {
    const c = {
      x: 0,
      y: 0,
      z: 0,
      r: 0,
    };
    const m = new THREE.Object3D();
    const p = this.createGeom(width, height);
    m.add(p);
    this.createBoxChar();
    return m;
  }
  createGeom(width: number, height: number) {
    width = width * 10;
    height = height * 10;
    const obj = new THREE.Object3D();
    const geom = new THREE.BoxBufferGeometry(width, height, 10);

    const mat = new THREE.MeshBasicMaterial({
      color: 0x00dddd,
      opacity: 0.8,
      transparent: true,
    });
    const m = new THREE.Mesh(geom, mat);
    m.position.x += width / 2 - 5;
    m.position.y -= height / 2 - 5;
    m.layers.disable(2);
    this._box = m;
    obj.add(m);

    width += 0.1;
    height += 0.1;

    const v = this.createWireGeom(width, height);
    const lightMat = new THREE.MeshBasicMaterial({
      color: 0x7e7e7e,
    });

    v.forEach((ele) => {
      const curve = new THREE.LineCurve3(
        new THREE.Vector3(ele.x1, ele.y1, ele.z1),
        new THREE.Vector3(ele.x2, ele.y2, ele.z2)
      );
      const edge = new THREE.TubeBufferGeometry(curve, 1, 0.1, 3, false);
      const p = new THREE.Mesh(edge, lightMat);
      obj.add(p);
    });
    obj.position.z = -5;

    return obj;
  }
  createWireGeom(width: number, height: number) {
    return [
      { x1: -5, y1: -5, z1: -5, x2: width - 5, y2: -5, z2: -5 },
      { x1: -5, y1: -5, z1: -5, x2: -5, y2: height - 5, z2: -5 },
      { x1: -5, y1: -5, z1: -5, x2: -5, y2: -5, z2: 5 },
      { x1: -5, y1: -5, z1: 5, x2: width - 5, y2: -5, z2: 5 },
      { x1: -5, y1: -5, z1: 5, x2: -5, y2: height - 5, z2: 5 },
      { x1: -5, y1: height - 5, z1: 5, x2: -5, y2: height - 5, z2: -5 },
      { x1: -5, y1: height - 5, z1: 5, x2: width - 5, y2: height - 5, z2: 5 },
      {
        x1: width - 5,
        y1: height - 5,
        z1: 5,
        x2: width - 5,
        y2: height - 5,
        z2: -5,
      },
      {
        x1: width - 5,
        y1: -5,
        z1: 5,
        x2: width - 5,
        y2: -5,
        z2: -5,
      },
      { x1: width - 5, y1: -5, z1: -5, x2: width - 5, y2: height - 5, z2: -5 },
      { x1: width - 5, y1: height - 5, z1: -5, x2: -5, y2: height - 5, z2: -5 },
      { x1: width - 5, y1: height - 5, z1: 5, x2: width - 5, y2: -5, z2: 5 },
    ];
  }
  createBoxChar() {
    const char = new Char();
    char.mesh.position.x = 0;
    char.mesh.position.y -= 0;

    const clone = char.mesh.clone(true);
    clone.rotation.x = Math.PI / 2;
    clone.position.y -= 5;
    clone.position.z -= 5;

    const clone1 = char.mesh.clone(true);
    clone1.rotation.x -= Math.PI / 2;
    clone1.position.y += 5;
    clone1.position.z -= 5;

    const clone2 = char.mesh.clone(true);
    clone2.rotation.y = -Math.PI / 2;
    clone2.position.x -= 5;
    clone2.position.z -= 5;

    const clone3 = char.mesh.clone(true);
    clone3.rotation.y = Math.PI / 2;
    clone3.position.x += 5;
    clone3.position.z -= 5;

    const clone4 = char.mesh.clone(true);
    clone4.rotation.x = Math.PI;
    clone4.position.z -= 10;
    this._char = char;
    this.mesh.add(char.mesh, clone, clone1, clone2, clone3, clone4);
  }
  addChar(c: IChar) {
    try {
      const duration = c.endTime - c.startTime;
      this._char.drawEaseText(c.text, duration, 20);
    } catch ($e) {
      console.log($e);
    }
  }
}
