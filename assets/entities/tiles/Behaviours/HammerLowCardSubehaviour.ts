import { HammerCardSubehaviour } from "./HammerCardSubehaviour";

export class HammerLowCardSubehaviour extends HammerCardSubehaviour {
  protected powerCard = 0;
  prepare(): boolean {
    super.prepare();
    return true;
  }
}
