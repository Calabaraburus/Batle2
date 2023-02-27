import { FirewallCardSubehaviour } from "./FirewallCardSubehaviour";

export class FirewallMiddleCardSubehaviour extends FirewallCardSubehaviour {
  protected maxCountForEachSide = 2;
  prepare(): boolean {
    super.prepare();
    return true;
  }
}
