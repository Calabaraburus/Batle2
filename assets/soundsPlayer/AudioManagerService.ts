import { _decorator, AudioClip, CCString, Component, Node } from "cc";
import { Service } from "../entities/services/Service";
import { AudioManager } from "./AudioManager";
import { Queue } from "../scripts/Queue";
const { ccclass, property } = _decorator;

@ccclass("AudioManagerService")
export class AudioManagerService extends Service {
  private _currentMusicList: string[] = [];
  private _currentMusicId: number = 0;
  private _musicStoped = true;
  private _taskQueue: Queue<() => void> = new Queue<() => void>;

  @property(AudioClip)
  sounds: AudioClip[] = [];

  @property(AudioClip)
  music: AudioClip[] = [];

  get currentMusicList() {
    return this._currentMusicList;
  }

  set currentMusicList(value: string[]) {
    this._currentMusicList = value;
    this._currentMusicId = 0;

    this.refreshMusic()
  }

  playSoundEffect(soundName: string, oneShot = true) {
    const sound = this.getTargetSound(soundName);
    if (!sound) return;
    AudioManager.instance.playEffect(sound, oneShot);
  }

  refreshMusic() {
    AudioManager.instance.stop();
    this._musicStoped = false;
  }

  playMusic(audioName: string) {
    this._taskQueue.enqueue(() => this.internalPlayMusic(audioName));
  }

  stopMusic() {
    this._taskQueue.enqueue(() => this.internalStopMusic());
  }

  stop() {
    this.stopMusic();
  }

  private internalStopMusic() {
    this._musicStoped = true;
    AudioManager.instance.stop();
  }

  private internalPlayMusic(audioName: string) {
    const music = this.getTargetMusic(audioName);
    if (!music) return;

    AudioManager.instance.play(music);

    this._musicStoped = false;
  }

  getTargetSound(soundName: string) {
    return this.sounds.find((sound) => {
      return sound.name == soundName;
    });
  }

  getTargetMusic(audioName: string) {
    return this.music.find((audioClip) => {
      return audioClip.name == audioName;
    });
  }

  changeVolume(volume: number, audioType: string) {
    if (audioType == "music") {
      AudioManager.instance.audioSource.volume = volume;
      AudioManager.instance._volumeMusic = volume;
    }
    if (audioType == "sound") {
      AudioManager.instance.soundSource.volume = volume;
      AudioManager.instance._volumeSound = volume;
    }
  }

  protected update(dt: number): void {

    if (!this._taskQueue.isEmpty) {
      var task = this._taskQueue.dequeue();
      task();
      return;
    }

    if (!AudioManager.instance.isMusicPlaying && !this._musicStoped) {
      this.playMusic(this.currentMusicList[this._currentMusicId]);

      this._currentMusicId++;
      if (this._currentMusicId >= this.currentMusicList.length) {
        this._currentMusicId = 0;
      }

    }
  }
}
