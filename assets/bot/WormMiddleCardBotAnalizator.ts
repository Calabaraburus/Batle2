import { WormCardBotAnalizator } from "./WormCardBotAnalizator";

export class WormMiddleCardBotAnalizator extends WormCardBotAnalizator {
  protected bonusName = "wormMiddle";

  decide() {
    return super.decide();
  }
  analize(): number {
    return super.analize();
  }
}
