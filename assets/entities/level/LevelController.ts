import { Component, _decorator } from 'cc';
import { LevelModel } from '../../models/LevelModel';
import { AnalizedData } from '../field/AnalizedData';
import { FieldController } from '../field/FieldController';
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

    /** Field Controller */
    @property({ type: FieldController })
    fieldController: FieldController;

    start() {
        this.fieldController.endTurnEvent.on('FieldController', this.turnEnded, this);
        this.view.setController(this);
        this.updateData();
    }

    turnEnded(sender: FieldController, data: AnalizedData) {

        console.log("tiles killed" + data.justCreatedTiles.length);


        this.model.pointsCount -= data.justCreatedTiles.length;
        this.model.turnsCount -= 1;

        if (this.model.turnsCount < 0) {
            this.model.turnsCount = 0;

            if (this.model.pointsCount > 0) {
                this.view.showLose(true);
            }
        }

        if (this.model.pointsCount < 0) {
            this.model.pointsCount = 0;
            this.view.showWin(true);
        }

        this.updateData();
    }

    public updateData() {
        this.view.AimPoints = this.model.aimPoints;
        this.view.TurnsCount = this.model.turnsCount;
        this.view.PointsCount = this.model.pointsCount;
        this.view.Bonus1Price = this.model.bonus1Price;
        this.view.Bonus2Price = this.model.bonus2Price;
        this.view.Bonus3Price = this.model.bonus3Price;
    }
}

