import { MeteoriteCardSubehaviour } from "./MeteoriteCardSubehaviour";

export class MeteoriteMiddleCardSubehaviour extends MeteoriteCardSubehaviour {
  powerCard = 1;
  prepare(): boolean {
    super.prepare();
    return true;
  }
}
