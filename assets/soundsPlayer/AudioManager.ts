import { _decorator, AudioClip, AudioSource, director, Node } from "cc";
import { Service } from "../entities/services/Service";
const { ccclass, property } = _decorator;

@ccclass("AudioManager")
export class AudioManager extends Service {
  @property(AudioClip)
  sounds: AudioClip[] = [];
  private _audioSource: AudioSource;

  // private static _inst: AudioManager;
  // public static get inst(): AudioManager {
  //   if (this._inst == null) {
  //     this._inst = new AudioManager();
  //   }
  //   return this._inst;
  // }

  constructor() {
    super();

    const audioMgr = new Node();
    audioMgr.name = "__audioMgr__";

    director.getScene()?.addChild(audioMgr);

    director.addPersistRootNode(audioMgr);

    this._audioSource = audioMgr.addComponent(AudioSource);
  }

  get audioSource() {
    return this._audioSource;
  }

  playSoundEffect(soundName: string) {
    const sound = this.getTargetSound(soundName);
    if (!sound) return;
    this.audioSource.playOneShot(sound, 1);
  }

  getTargetSound(soundName: string) {
    return this.sounds.find((sound) => {
      return sound.name == soundName;
    });
  }
}
