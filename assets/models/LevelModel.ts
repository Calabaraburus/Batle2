import { CCInteger, Component, _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass("LevelModel")
export class LevelModel extends Component {
  /** Turns count */
  @property({ type: CCInteger })
  turnsCount = 0;

  /** Max turns */
  @property({ type: CCInteger })
  maxTurns = 0;

  /** Aimponts */
  @property({ type: CCInteger })
  aimPoints = 200;

  /** Ponts count */
  @property({ type: CCInteger })
  pointsCount = 0;

  /** Player life */
  @property({ type: CCInteger })
  playerLife = 100;

  /** Enemy life */
  @property({ type: CCInteger })
  enemyLife = 100;

  /** Enemy power */
  @property({ type: CCInteger })
  enemyPower = 2;

  /** Player power */
  @property({ type: CCInteger })
  playerPower = 2;

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
