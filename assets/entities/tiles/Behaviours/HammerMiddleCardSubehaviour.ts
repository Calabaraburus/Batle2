import { HammerCardSubehaviour } from "./HammerCardSubehaviour";

export class HammerMiddleCardSubehaviour extends HammerCardSubehaviour {
  protected powerCard = 1;
  prepare(): boolean {
    super.prepare();
    return true;
  }
}
