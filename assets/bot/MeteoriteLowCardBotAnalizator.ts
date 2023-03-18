import { MeteoriteCardBotAnalizator } from "./MeteoriteCardBotAnalizator";

export class MeteoriteLowCardBotAnalizator extends MeteoriteCardBotAnalizator {
  protected powerMeteorite = 0;
  protected powerCoef = 1;
  protected bonusName = "meteoriteLow";
  decide() {
    return super.decide();
  }
  analize(): number {
    return super.analize();
  }
}
