//  Bot.ts - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras

import { Component, _decorator } from "cc";
import { FieldController } from "../entities/field/FieldController";
import { IBot } from "./IBot";
const { ccclass, property } = _decorator;

@ccclass("Bot")
export class Bot extends Component implements IBot {
  public move(field: FieldController): void {
    throw new Error();
  }

  private analize(field: FieldController): boolean {
    throw new Error();
    //field.logicField;
  }
}
