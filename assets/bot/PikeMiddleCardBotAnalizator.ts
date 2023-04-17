import { PikeCardBotAnalizator } from "./PikeCardBotAnalizator";

export class PikeMiddleCardBotAnalizator extends PikeCardBotAnalizator {
  protected powerCoef = 3;
  protected bonusName = "pikeMiddle";
  protected coord = [-1, 1];
  decide() {
    return super.decide();
  }
  analize(): number {
    return super.analize();
  }
}
