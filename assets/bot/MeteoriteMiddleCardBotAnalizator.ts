import { MeteoriteCardBotAnalizator } from "./MeteoriteCardBotAnalizator";

export class MeteoriteMiddleCardBotAnalizator extends MeteoriteCardBotAnalizator {
  protected powerMeteorite = 1;
  protected powerCoef = 3;
  protected bonusName = "meteoriteMiddle";
  decide() {
    return super.decide();
  }
  analize(): number {
    return super.analize();
  }
}
