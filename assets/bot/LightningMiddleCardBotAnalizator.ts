import { LightningCardBotAnalizator } from "./LightningCardBotAnalizator";

export class LightningMiddleCardBotAnalizator extends LightningCardBotAnalizator {
  protected bonusName = "lightningMiddle";
  decide() {
    return super.decide();
  }
  analize(): number {
    return super.analize();
  }
}
