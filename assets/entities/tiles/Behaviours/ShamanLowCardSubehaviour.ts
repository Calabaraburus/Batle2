import { ShamanCardSubehaviour } from "./ShamanCardSubehaviour";

export class ShamanLowCardSubehaviour extends ShamanCardSubehaviour {
  protected lvlTile = "shamanLow";
  prepare(): boolean {
    super.prepare();
    return true;
  }
}
