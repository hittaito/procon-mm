import { Player } from "textalive-app-api";
import { TAController } from "./class/TAController";
import { ThreeController } from "./class/ThreeController";

class Main {
  _TAController: TAController;
  _THREEController: ThreeController;
  init() {
    this._TAController = new TAController();
    this._TAController.init();
    this._THREEController = ThreeController.getInstance();
    window.addEventListener("resize", () => this.resize());
  }
  resize() {
    this._THREEController.resize();
  }
}
const main = new Main();
main.init();
