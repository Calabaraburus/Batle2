import { _decorator, Component, Prefab, instantiate, CCString } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TileContollerListItem')
export class TileContollerListItem {
  @property(CCString)
  name: string;

  @property(Prefab)
  prefab: Prefab;
}
