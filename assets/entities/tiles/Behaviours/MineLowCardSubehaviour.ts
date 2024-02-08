import { MineCardSubehaviour } from "./MineCardSubehaviour";

export class MineLowCardSubehaviour extends MineCardSubehaviour {
  prepare(): boolean {
    super.prepare();
    return true;
  }
}
