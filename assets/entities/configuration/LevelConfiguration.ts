import { _decorator, CCString, Component, Node } from "cc";
import { PlayerModel } from "../../models/PlayerModel";
const { ccclass, property } = _decorator;

@ccclass("LevelConfiguration")
export class LevelConfiguration extends Component {
  private _playerModels: PlayerModel[];

  @property(CCString)
  playerHeroName = "bear";

  @property(CCString)
  botHeroName = "lion";

  private _playerModel: PlayerModel;
  public get playerModel(): PlayerModel {
    return this._playerModel;
  }

  private _botModel: PlayerModel;
  public get botModel(): PlayerModel {
    return this._botModel;
  }

  start() {
    this._playerModels = this.getComponentsInChildren(PlayerModel);

    this._playerModel = this.getModel(this.playerHeroName);
    this._botModel = this.getModel(this.botHeroName);
  }

  public getModel(name: string): PlayerModel {
    const result = this._playerModels.find((pm) => pm.playerName == name);

    if (result == null) throw Error(`No player model with name: ${name}`);

    return result;
  }
}
