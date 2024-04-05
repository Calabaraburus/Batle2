import { _decorator, AudioClip, CCString, Component, Node } from "cc";
import { Service } from "../entities/services/Service";
import { AudioManager } from "./AudioManager";
const { ccclass, property } = _decorator;

@ccclass("AudioManagerService")
export class AudioManagerService extends Service {
  @property(AudioClip)
  sounds: AudioClip[] = [];

  @property(AudioClip)
  music: AudioClip[] = [];

  @property(CCString)
  mainTheme: string;

  start() {
    this.playMusic(this.mainTheme);
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
  }

  stopMusic() {
    // const music = this.getTargetMusic(audioName);
    // if (!music) return;
    AudioManager.instance.stop();
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
}
