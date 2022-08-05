import { CCInteger, Component, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LevelModel')
export class LevelModel extends Component {

    /** Turns count */
    @property({ type: CCInteger })
    turnsCount: number = 50;

    /** Aimponts */
    @property({ type: CCInteger })
    aimPoints: number = 200;

    /** Ponts count */
    @property({ type: CCInteger })
    pointsCount: number = 0;

    /** bonus price 1 label */
    @property({ type: CCInteger })
    bonus1Price: number = 20;

    /** bonus price 2 label */
    @property({ type: CCInteger })
    bonus2Price: number = 30;

    /** bonus price 3 label */
    @property({ type: CCInteger })
    bonus3Price: number = 40;
}


