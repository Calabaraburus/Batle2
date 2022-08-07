import { CCFloat, Component, Label, Node, Vec3, _decorator } from 'cc';
import { LevelModel } from '../../models/LevelModel';
import { ILevelView } from './ILevelView';
import { LevelController } from './LevelController';
const { ccclass, property } = _decorator;

@ccclass('LevelView')
export class LevelView extends Component implements ILevelView {

    //#region Privates

    private _model: LevelModel;
    private _controller: LevelController;
    private _aimPoints = 0;
    private _pointsCount = 0;

    //#endregion

    //#region Cocos properties

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

    /** Load line node */
    @property({ type: Node })
    loadLine: Node;

    /** Win block */
    @property({ type: Node })
    winBlock: Node;

    /** Lose block */
    @property({ type: Node })
    loseBlock: Node;

    /** Load line min pos */
    @property({ type: CCFloat })
    loadLineZeroPos: number;

    /** Load line max pos */
    @property({ type: CCFloat })
    loadLineEndPos: number;

    //#endregion

    //#region IListView

    public get TurnsCount(): number {
        return Number(this.turnsCountLbl.string);
    }
    public set TurnsCount(value: number) {
        this.turnsCountLbl.string = value.toString();
    }

    public get AimPoints(): number {
        return this._aimPoints;
    }
    public set AimPoints(value: number) {
        this._aimPoints = value;
        this.updateLoadLinePos();
    }

    public get PointsCount(): number {
        return Number(this.pointsCountLbl.string);
    }
    public set PointsCount(value: number) {
        this.pointsCountLbl.string = value.toString();
        this._pointsCount = value;
        this.updateLoadLinePos();
    }

    public get Bonus1Price(): number {
        return Number(this.bonus1PriceLbl.string);
    }
    public set Bonus1Price(value: number) {
        this.bonus1PriceLbl.string = value.toString();
    }

    public get Bonus2Price(): number {
        return Number(this.bonus2PriceLbl.string);
    }
    public set Bonus2Price(value: number) {
        this.bonus2PriceLbl.string = value.toString();
    }

    public get Bonus3Price(): number {
        return Number(this.bonus3PriceLbl.string);
    }
    public set Bonus3Price(value: number) {
        this.bonus3PriceLbl.string = value.toString();
    }

    public showWin(show: boolean) {
        this.winBlock.active = show;
    }

    public showLose(show: boolean) {
        this.loseBlock.active = show;
    }

    //#endregion

    public pause(show: boolean) {

    }

    public bonusBtnClick(bonusName: string) {
        this._controller.setBonus(bonusName);
    }

    public resetGame() {
        this.showWin(false);
        this.showLose(false);
        this._controller.resetGame();
    }

    public setController(controller: LevelController): void {
        this._controller = controller;
    }

    private updateLoadLinePos() {
        const coef = (this.loadLineEndPos - this.loadLineZeroPos) / this._aimPoints;

        this.loadLine.position =
            new Vec3(coef * this._pointsCount + this.loadLineZeroPos,
                this.loadLine.position.y, this.loadLine.position.z)
    }

}

