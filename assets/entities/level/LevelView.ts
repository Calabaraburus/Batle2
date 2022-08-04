import { Component, Label, labelAssembler, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LevelView')
export class LevelView extends Component {

    /** Turns count label */
    @property({ type: Label })
    turnsCountLbl: Label;

    /** Points count label */
    @property({ type: Label })
    pointsCountLbl: Label;

    /** bonus price 1 label */
    @property({ type: Label })
    bonus1PriceLbl: Label;

    /** bonus price 2 label */
    @property({ type: Label })
    bonus2PriceLbl: Label;

    /** bonus price 3 label */
    @property({ type: Label })
    bonus3PriceLbl: Label;

    public pause()
    {
        
    }
}
