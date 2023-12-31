import { DEBUG } from "cc/env";
import { DebugView } from "../entities/ui/debugger/DebugView";


export class DebugViewForBot extends DebugView {
    public log(value: string) {
        if (DEBUG) {
            super.log(value);
        }
    }
}
