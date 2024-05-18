import { _decorator, AudioClip, CCString, Component, Node } from "cc";
import { Service } from "../entities/services/Service";
import { AudioManager } from "./AudioManager";
const { ccclass, property } = _decorator;

@ccclass("AudioManagerService")
export class AudioManagerService extends Service {
  private _currentMusicList: string[] = [];
  private _currentMusicId: number = 0;
  private _musicStoped = true;

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
    this.stopMusic();
    this.playMusic(this._currentMusicList[this._currentMusicId]);
  }


  start() {
  }

  playSoundEffect(soundName: string) {
    const sound = this.getTargetSound(soundName);
    if (!sound) return;
    AudioManager.instance.playOneShot(sound);
  }

  playMusic(audioName: string) {
    const music = this.getTargetMusic(audioName);
    if (!music) return;
    AudioManager.instance.play(music);
    this._musicStoped = false;
  }

  stopMusic() {
    // const music = this.getTargetMusic(audioName);
    // if (!music) return;
    AudioManager.instance.stop();
    this._musicStoped = true;
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
    if (!AudioManager.instance.isMusicPlaying && !this._musicStoped) {
      this.playMusic(this.currentMusicList[this._currentMusicId]);

      this._currentMusicId++;
      if (this._currentMusicId >= this.currentMusicList.length) {
        this._currentMusicId = 0;
      }

    }
  }
}
