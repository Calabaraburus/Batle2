import { LightningCardSubehaviour } from "./LightningCardSubehaviour";

export class LightningMiddleCardSubehaviour extends LightningCardSubehaviour {
  protected maxCount = 8;

  prepare(): boolean {
    super.prepare();
    return true;
  }
}
