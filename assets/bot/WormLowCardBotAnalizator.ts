import { WormCardBotAnalizator } from "./WormCardBotAnalizator";

export class WormLowCardBotAnalizator extends WormCardBotAnalizator {
  protected bonusName = "wormLow";

  decide() {
    return super.decide();
  }
  analize(): number {
    return super.analize();
  }
}
