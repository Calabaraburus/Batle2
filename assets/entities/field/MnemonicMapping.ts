import { CCString, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MnemonicMapping')
export class MnemonicMapping {
    @property({ type: CCString })
    tileName: string;

    @property({ type: CCString })
    mnemonic: string;
}
