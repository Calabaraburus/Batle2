import { Component, Label, labelAssembler, _decorator } from 'cc';
import { LevelModel } from '../../models/LevelModel';
const { ccclass, property } = _decorator;

@ccclass('LevelView')
export class LevelView extends Component {

    private _model: LevelModel;

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

    public pause() {

    }

    public updateData(model: LevelModel) {
        this._model = model;

        this.turnsCountLbl.string = model.turnsCount.toString();
        this.pointsCountLbl.string = model.pointsCount.toString();
        this.bonus1PriceLbl.string = model.bonus1Price.toString();
        this.bonus2PriceLbl.string = model.bonus2Price.toString();
        this.bonus3PriceLbl.string = model.bonus3Price.toString();
    }
}
