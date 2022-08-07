import {
    _decorator,
} from 'cc';
const { ccclass, property } = _decorator;

import { TileModel } from './TileModel';

/**
 * Represents bonus model
 */

@ccclass('BonusModel')
export class BonusModel {
    public price: number;
    public type: TileModel;
}
