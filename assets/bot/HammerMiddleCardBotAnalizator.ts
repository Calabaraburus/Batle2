import { HammerCardBotAnalizator } from "./HammerCardBotAnalizator";

export class HammerMiddleCardBotAnalizator extends HammerCardBotAnalizator {
  protected powerCoef = 2;
  protected bonusName = "hammerMiddle";
  decide() {
    return super.decide();
  }
  analize(): number {
    return super.analize();
  }
}
