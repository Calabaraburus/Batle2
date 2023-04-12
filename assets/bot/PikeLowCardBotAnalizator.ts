import { PikeCardBotAnalizator } from "./PikeCardBotAnalizator";

export class PikeLowCardBotAnalizator extends PikeCardBotAnalizator {
  protected powerCoef = 2;
  protected bonusName = "pikeLow";
  protected coord = [0];
  decide() {
    return super.decide();
  }
  analize(): number {
    return super.analize();
  }
}
