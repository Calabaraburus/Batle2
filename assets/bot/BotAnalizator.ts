import { AnalizedData } from "../entities/field/AnalizedData";
import { Bot } from "./Bot";

export class BotAnalizator {
  bot: Bot;

  private _weight = 0;
  public get weight() {
    return this._weight;
  }

  protected set weight(value: number) {
    this._weight = value;
  }

  constructor(bot: Bot) {
    this.bot = bot;
  }

  getBonus(tileMnem: string) {
    if (this.bot.botModel == null) return null;
    return this.bot.botModel.bonuses.find((b) => b.mnemonic == tileMnem);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  analize(data: AnalizedData): number {
    throw Error("Not implemented method");
  }

  decide() {
    throw Error("Not implemented method");
  }
}
