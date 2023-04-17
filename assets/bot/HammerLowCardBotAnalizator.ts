import { HammerCardBotAnalizator } from "./HammerCardBotAnalizator";

export class HammerLowCardBotAnalizator extends HammerCardBotAnalizator {
  protected powerCoef = 1;
  protected bonusName = "hammerLow";
  decide() {
    return super.decide();
  }
  analize(): number {
    return super.analize();
  }
}
