import { CCInteger, Component, _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass("LevelModel")
export class LevelModel extends Component {
  /** Turns count */
  @property({ type: CCInteger })
  turnsCount = 50;

  /** Aimponts */
  @property({ type: CCInteger })
  aimPoints = 200;

  /** Ponts count */
  @property({ type: CCInteger })
  pointsCount = 0;

  /** bonus price 1 label */
  @property({ type: CCInteger })
  bonus1Price = 20;

  /** bonus price 2 label */
  @property({ type: CCInteger })
  bonus2Price = 30;

  /** bonus price 3 label */
  @property({ type: CCInteger })
  bonus3Price = 40;
}
