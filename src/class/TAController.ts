import { IPlayerApp, IVideo, Player, Timer } from "textalive-app-api";
import { AnimationController } from "./AnimationController";

export class TAController {
  _player: Player;
  _animationController: AnimationController;
  _jumpBtn = document.querySelector("#jump") as HTMLButtonElement;

  constructor() {}
  init() {
    this._animationController = AnimationController.getInstance();
    this._animationController.setUp();
    this._player = new Player({
      app: {
        appAuthor: "hittaito",
        appName: "procon-test",
      },
      mediaElement: document.querySelector("#media"),
    });
    this._player.addListener({
      onAppReady: this.onAppReady,
      onVideoReady: this.onVideoReady,
      onTimeUpdate: this.onTimeUpdate,
      onTimerReady: this.onTimerReady,
      onThrottledTimeUpdate: this.onThrottledTimeUpdate,
      onPlay: this.onPlay,
      onPause: this.onPause,
      onStop: this.onStop,
    });

    const artistSpan = document.querySelector("#artist span");
    const songSpan = document.querySelector("#song span");
  }
  onAppReady = (app: IPlayerApp) => {
    if (!app.managed) {
      const playBtns = document.querySelectorAll(".play");
      playBtns.forEach((playBtn) =>
        playBtn.addEventListener(
          "click",
          () => this._player.video && this._player.requestPlay()
        )
      );

      const pauseBtn = document.querySelector("#pause");
      pauseBtn.addEventListener(
        "click",
        () => this._player.video && this._player.requestPause()
      );
    }
    if (!app.songUrl) {
      this._player.createFromSongUrl(
        "http://www.youtube.com/watch?v=XSLhsjepelI"
      );
    }
  };
  onVideoReady = (v: IVideo) => {
    this._animationController.setPhrases(this._player.video.phrases);
  };
  onTimeUpdate = (position: number) => {
    this._animationController.update(position);
  };

  onTimerReady = (t: Timer) => {
    if (!this._player.app.managed) {
      document
        .querySelectorAll("button")
        .forEach((btn) => (btn.disabled = false));
      this._animationController.setVideo();
    }
  };
  onThrottledTimeUpdate(position: number) {}
  onPlay = () => {};
  onPause = () => {};
  onStop = () => {};
}
