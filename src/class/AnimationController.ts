import { IChar, IPhrase, PhraseData } from "textalive-app-api";
import { ThreeController } from "./ThreeController";

export class AnimationController {
  private static instance: AnimationController;
  time: number;
  _char: IChar = null;
  _charAnim: IChar = null;
  _phraseAnim: IPhrase = null;
  _phraseIndex: number;
  phrase: IPhrase[];
  _threeController: ThreeController;

  private constructor() {}

  static getInstance() {
    if (!AnimationController.instance) {
      AnimationController.instance = new AnimationController();
    }
    return AnimationController.instance;
  }
  setUp() {
    this._threeController = ThreeController.getInstance();
  }
  setPhrases(p: IPhrase[]) {
    this.phrase = p;
  }
  setVideo() {
    this._threeController.animationType = "done";
  }
  update(position: number) {
    if (position < 1000) {
      this._threeController.animationType = "rotate";
    }
    if (position > 237000) {
      this._threeController.animationType = "finish";
      return;
    }
    // char animation
    position += 2800;
    const idx = this.phrase.findIndex((p) => p.contains(position));

    if (this._phraseIndex !== idx && idx !== -1) {
      switch (idx) {
        case 0:
          this._threeController.animationType = "rotate";
          break;
        case 4:
        case 18:
          this._threeController.animationType = "boxMove";
          break;
        case 34:
          this._threeController.animationType = "cBoxMove";
          break;
        case 8:
        case 25:
          this._threeController.animationType = "tornado";
          break;
        case 38:
          this._threeController.animationType = "cTornado";
          break;
        case 16:
        case 32:
          this._threeController.animationType = "stream";
          this._threeController.setStage();
          break;
        case 42:
          this._threeController.animationType = "color";
          this._threeController.setStage();
          break;
      }
      this._phraseIndex = idx;
    }
    if (idx === -1) {
      switch (this._phraseIndex) {
        case 3:
          this._threeController.animationType = "pause1";
          this._threeController.setStage();
          break;
        case 17:
          this._threeController.animationType = "pause2";
          this._threeController.setStage();
          break;
        case 33:
          this._threeController.animationType = "pause3";
          this._threeController.setStage();
          break;
        case 45:
          this._threeController.animationType = "pause4";
          break;
      }
    }
    const ward = this.phrase[idx].children.find((w) => w.contains(position));
    const char = ward.children.find((c) => c.contains(position));
    if (this._phraseAnim != this.phrase[idx]) {
      this._threeController.updatePhraseAnime(this.phrase[idx]);
      this._phraseAnim = this.phrase[idx];
    }
    if (this._char != char) {
      this._threeController.updateChar(char);
      this._char = char;
    }
  }
}
