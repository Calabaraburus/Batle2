import { WormCardSubehaviour } from "./WormCardSubehaviour";

export class WormMiddleCardSubehaviour extends WormCardSubehaviour {
  maxCount = 6;

  prepare(): boolean {
    super.prepare();
    return true;
  }
}
