//  BonusModel.ts - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras

import { _decorator } from "cc";
const { ccclass } = _decorator;

import { TileModel } from "./TileModel";

/**
 * Represents bonus model
 */
@ccclass("BonusModel")
export class BonusModel {
  public price: number;
  public type: TileModel;
}
