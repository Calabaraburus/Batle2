//  IBot.ts - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras

import { FieldController } from "../entities/field/FieldController";

export interface IBot {
  move(field: FieldController): void;
}
