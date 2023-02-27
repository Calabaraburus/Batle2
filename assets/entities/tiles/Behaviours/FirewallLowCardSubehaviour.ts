import { FirewallCardSubehaviour } from "./FirewallCardSubehaviour";

export class FirewallLowCardSubehaviour extends FirewallCardSubehaviour {
  protected maxCountForEachSide = 1;
  prepare(): boolean {
    super.prepare();
    return true;
  }
}
