import { Bot } from "./Bot";
import { BotAnalizator } from "./BotAnalizator";

export class CardAnalizator extends BotAnalizator {
  private _cardMnemonic: string;

  public get cardMnemonic(): string {
    return this._cardMnemonic;
  }

  constructor(cardMnemonic: string, bot: Bot) {
    super(bot);
    this._cardMnemonic = cardMnemonic;
  }
}
