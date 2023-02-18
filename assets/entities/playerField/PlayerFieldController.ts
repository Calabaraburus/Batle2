import { _decorator, Component, Label } from "cc";
import { PlayerModel } from "../../models/PlayerModel";
import { CardController } from "./cardField/CardController";
import { CardFieldController } from "./cardField/CardFieldController";
const { ccclass, property } = _decorator;

@ccclass("PlayerFieldController")
export class PlayerFieldController extends Component {
  @property(PlayerModel)
  playerModel: PlayerModel;

  @property(CardFieldController)
  cardField: CardFieldController;

  @property(Label)
  lblMana: Label;

  start() {
    this.cardField.bonuses = this.playerModel.bonuses;
    this.cardField.node.on(
      "selectedCardChanged",
      this.selectedCardChanged,
      this
    );
    this.updateData();
  }

  public selectedCardChanged(card: CardController | null) {
    if (card != null) {
      this.playerModel.setBonus(card.model);
    } else {
      this.playerModel.unSetBonus();
    }
  }

  public updateData() {
    this.lblMana.string =
      this.playerModel.manaCurrent.toString() +
      "/" +
      this.playerModel.manaMax.toString();

    this.cardField.updateData();
  }
}
