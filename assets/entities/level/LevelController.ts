import { Component, Node, _decorator } from 'cc';
import { BonusModel } from '../../models/BonusModel';
import { LevelModel } from '../../models/LevelModel';
import { AnalizedData } from '../field/AnalizedData';
import { FieldController } from '../field/FieldController';
import { TileInterBehaviour } from '../tiles/TileInterBehaviour';
import { ILevelView } from './ILevelView';
import { LevelView } from './LevelView';
const { ccclass, property } = _decorator;

/** Controls level view. */
@ccclass('LevelController')
export class LevelController extends Component {
    private _turnsCount: number;

    /** Level view */
    @property({ type: LevelView })
    view: ILevelView;

    /** Level model */
    @property({ type: LevelModel })
    model: LevelModel;

    /** Field Controller */
    @property({ type: FieldController })
    fieldController: FieldController;

    /** Behaviours node */
    @property({ type: Node })
    behavioursNode: Node;

    start() {
        this.fieldController.endTurnEvent.on('FieldController', this.turnEnded, this);
        this.view.setController(this);
        this._turnsCount = this.model.turnsCount;
        this.updateData();
        this.initBehaviours();
    }

    initBehaviours() {
        var behavs = this.behavioursNode.getComponents(TileInterBehaviour);

        behavs.sort((a, b) => a.order - b.order);

        behavs.forEach(b => {
            b.field = this.fieldController;
        });
    }

    turnEnded(sender: FieldController, data: AnalizedData) {

        console.log("tiles killed" + data.justCreatedTiles.length);


        this.model.pointsCount += data.justCreatedTiles.length;
        this.model.turnsCount -= 1;

        if (this.model.turnsCount < 0) {
            this.model.turnsCount = 0;

            if (this.model.pointsCount < this.model.aimPoints) {
                this.view.showLose(true);
            }
        }

        if (this.model.pointsCount >= this.model.aimPoints) {
            this.model.pointsCount = this.model.aimPoints;
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

    public resetGame() {
        this.model.pointsCount = 0;
        this.model.turnsCount = this._turnsCount;

        this.updateData();

        this.fieldController.Reset();
    }

    public setBonus(name: string) {
        const bonus = new BonusModel();
        bonus.price = 15;
        bonus.type = this.fieldController.fieldModel.getTileModel("bomb");
        this.fieldController.setBonus(bonus);
    }
}

