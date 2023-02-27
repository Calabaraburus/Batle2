import { WormCardSubehaviour } from "./WormCardSubehaviour";

export class WormLowCardSubehaviour extends WormCardSubehaviour {
  maxCount = 4;

  prepare(): boolean {
    super.prepare();
    return true;
  }
}
