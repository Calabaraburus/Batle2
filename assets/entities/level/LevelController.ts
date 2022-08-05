import { Component, _decorator } from 'cc';
import { LevelModel } from '../../models/LevelModel';
import { ILevelView } from './ILevelView';
import { LevelView } from './LevelView';
const { ccclass, property } = _decorator;

/** Controls level view. */
@ccclass('LevelController')
export class LevelController extends Component {

    /** Level view */
    @property({ type: LevelView })
    view: ILevelView;

    /** Level model */
    @property({ type: LevelModel })
    model: LevelModel;

    start() {
        this.view.setController(this);
        this.updateData();
    }

    public updateData() {

        this.view.TurnsCount = this.model.turnsCount;
        this.view.PointsCount = this.model.pointsCount;
        this.view.Bonus1Price = this.model.bonus1Price;
        this.view.Bonus2Price = this.model.bonus2Price;
        this.view.Bonus3Price = this.model.bonus3Price;
    }
}

