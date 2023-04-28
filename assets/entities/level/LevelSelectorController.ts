//  LevelSelectorController.ts - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras

import { Component, director, _decorator } from "cc";
import { ILevelSelectorController } from "./ILevelSelectorController";
import { TransitionScene } from "../menu/TransitionScene";
const { ccclass } = _decorator;

@ccclass("LevelSelectorController")
export class LevelSelectorController
  extends Component
  implements ILevelSelectorController
{
  loadLevel(levelName: string): void {
    director.loadScene(levelName);
    // this._tarnsitionScene.prepareLoadScene(levelName);
  }
}
