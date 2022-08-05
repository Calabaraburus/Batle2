import { Component, Label, labelAssembler, _decorator } from 'cc';
import { LevelModel } from '../../models/LevelModel';
import { ILevelView } from './ILevelView';
import { LevelController } from './LevelController';
const { ccclass, property } = _decorator;

@ccclass('LevelView')
export class LevelView extends Component implements ILevelView {

    //#region Privates

    private _model: LevelModel;
    private _controller: LevelController;

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


    //#endregion

    //#region IListView

    public get TurnsCount(): number {
        return Number(this.turnsCountLbl.string);
    }
    public set TurnsCount(value: number) {
        this.turnsCountLbl.string = value.toString();
    }

    private _aimPoints;
    public get AimPoints(): number {
        return this._aimPoints;
    }
    public set AimPoints(value: number) {
        this._aimPoints = value;
    }

    public get PointsCount(): number {
        return Number(this.pointsCountLbl.string);
    }
    public set PointsCount(value: number) {
        this.pointsCountLbl.string = value.toString();
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

    //#endregion

    public pause() {

    }

    public setController(controller: LevelController): void {
        this._controller = controller;
    }

}

