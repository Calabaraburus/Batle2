import { WormCardSubehaviour } from "./WormCardSubehaviour";

export class WormMiddleCardSubehaviour extends WormCardSubehaviour {
  maxCount = 5;

  prepare(): boolean {
    super.prepare();
    return true;
  }
}
