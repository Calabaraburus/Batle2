import { _decorator, AudioClip, Component, Node } from "cc";
import { Service } from "../entities/services/Service";
import { AudioManager } from "./AudioManager";
const { ccclass, property } = _decorator;

@ccclass("AudioManagerService")
export class AudioManagerService extends Service {
  @property(AudioClip)
  sounds: AudioClip[] = [];

  @property(AudioClip)
  music: AudioClip[] = [];

  playSoundEffect(soundName: string) {
    const sound = this.getTargetSound(soundName);
    if (!sound) return;
    AudioManager.instance.playOneShot(sound, 1);
  }

  playMusic(audioName: string) {
    const music = this.getTargetMusic(audioName);
    if (!music) return;
    AudioManager.instance.play(music);
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

  changeVolume(volume: number) {
    AudioManager.instance.audioSource.volume = volume;
  }
}
