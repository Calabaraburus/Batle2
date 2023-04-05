import { LightningCardBotAnalizator } from "./LightningCardBotAnalizator";

export class LightningLowCardBotAnalizator extends LightningCardBotAnalizator {
  protected bonusName = "lightningLow";
  decide() {
    return super.decide();
  }
  analize(): number {
    return super.analize();
  }
}
