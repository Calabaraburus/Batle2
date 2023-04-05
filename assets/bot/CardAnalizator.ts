import { BonusModel } from "../models/BonusModel";
import { LevelModel } from "../models/LevelModel";
import { Bot } from "./Bot";
import { BotAnalizator } from "./BotAnalizator";

export class CardAnalizator extends BotAnalizator {
  private _cardMnemonic: string;
  private _levelModel: LevelModel | null;

  public get cardMnemonic(): string {
    return this._cardMnemonic;
  }

  constructor(cardMnemonic: string, bot: Bot) {
    super(bot);
    this._cardMnemonic = cardMnemonic;
    this._levelModel = bot.getService(LevelModel);
  }

  public canActivateCard(card: BonusModel): boolean {
    if (this.bot.tileService == null) return false;
    if (this.bot.botModel == null) return false;

    if (this._levelModel?.gameMechanicType == 0) {
      return this.bot.botModel.manaCurrent >= card.priceToActivate;
    } else {
      return card.currentAmmountToActivate >= card.priceToActivate;
    }
  }
}
