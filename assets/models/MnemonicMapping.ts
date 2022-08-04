import { CCString, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MnemonicMapping')
export class MnemonicMapping {
    @property({})
    tileName: string = 'tile';

    @property({})
    mnemonic: string = 'mnem';
}


