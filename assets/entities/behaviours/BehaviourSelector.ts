import { _decorator, Component, js, Node, director } from "cc";
import { PlayerModel } from "../../models/PlayerModel";
import { helpers } from "../../scripts/helpers";
import { FieldController } from "../field/FieldController";
import { DebugView } from "../ui/debugger/DebugView";
import { Behaviour } from "./Behaviour";
const { ccclass, property } = _decorator;

@ccclass("BehaviourSelector")
export class BehaviourSelector extends Component {
  private _behavioursDictionary: Map<string, Behaviour[]> = new Map<
    string,
    Behaviour[]
  >();
  private _curBehaviours: Behaviour[] = [];
  private _debug: DebugView | null | undefined;

  start() {
    this._debug = director.getScene()?.getComponentInChildren(DebugView);
    this.fillBehavDict(this.getComponentsInChildren(Behaviour));
  }

  public hasBehavioursInProccess(): boolean {
    let has = false;
    this._behavioursDictionary.forEach((val) => {
      if (has) return;
      val.forEach((b) => {
        if (b.inProcess) {
          has = true;
          return;
        }
      });
    });

    return has;
  }

  fillBehavDict(behavs: Behaviour[]): void {
    this._debug?.log("[behaviour][selector] start fill bihave dicts");

    behavs.forEach((b) => {
      if (!this._behavioursDictionary.has(b.type)) {
        this._behavioursDictionary.set(b.type, []);
        this._debug?.log(`[behaviour][selector] selector set '${b.type}'`);
      }

      const list = this._behavioursDictionary.get(b.type);
      list?.push(b);

      this._debug?.log(`[behaviour][selector] selector push '${b.type}'`);
    });
  }

  run(target: Component) {
    this._debug?.log(`[behaviour][selector] selector run`);

    if (this._curBehaviours.length <= 0) {
      this._curBehaviours = this.select(target);
    }

    if (this._curBehaviours.length > 0) {
      this._debug?.log(`[behaviour][selector] start iterate over behaves`);

      // run all behaviours for given target
      const stopedBehaves: Behaviour[] = [];
      this._curBehaviours.forEach((b) => {
        try {
          b.target = target;
          if (b.isStoped) {
            b.activate();
          }
          this._debug?.log(
            `[behaviour][selector]Try run behaviour ${b.serviceType}`
          );
          b.run();

          if (b.isStoped) {
            stopedBehaves.push(b);
          }
        } catch (error) {
          if (error instanceof Error) {
            this._debug?.log(`[behaviour][selector] Error ${error.message}`);
          }
        }
      });

      this._debug?.log(`[behaviour][selector] stop iterate over behaves`);

      this._debug?.log(`[behaviour][selector] clear stoped behaves`);

      // remove stoped behaves
      stopedBehaves.forEach((b) => {
        const index = this._curBehaviours.indexOf(b, 0);
        if (index > -1) {
          this._curBehaviours.splice(index, 1);
        }
      });
    }
  }

  public hasActiveBehaviours() {
    return this._curBehaviours.length > 0;
  }

  select(target: Component): Behaviour[] {
    this._debug?.log(`[behaviour][selector] select behaves for target`);

    const type = js.getClassName(target);

    this._debug?.log(`[behaviour][selector] target type: '${type}'`);

    const result: Behaviour[] = [];
    if (this._behavioursDictionary.has(type)) {
      const list = this._behavioursDictionary.get(type);
      list?.forEach((b) => {
        b.target = target;
        if (b.activateCondition()) {
          this._debug?.log(
            `[behaviour][selector] target pass condition of behave '${b.type}'`
          );
          result.push(b);
        }
      });
    }

    return result;
  }
}
