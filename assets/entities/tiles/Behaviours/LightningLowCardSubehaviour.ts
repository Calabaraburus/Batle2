import { LightningCardSubehaviour } from "./LightningCardSubehaviour";

export class LightningLowCardSubehaviour extends LightningCardSubehaviour {
  protected maxCount = 5;

  prepare(): boolean {
    super.prepare();
    return true;
  }
}
