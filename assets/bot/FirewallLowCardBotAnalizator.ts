import { FirewallCardBotAnalizator } from "./FirewallCardBotAnalizator";

export class FirewallLowCardBotAnalizator extends FirewallCardBotAnalizator {
  protected powerCoef = 2;
  protected bonusName = "firewallLow";
  decide() {
    return super.decide();
  }
  analize(): number {
    return super.analize();
  }
}
