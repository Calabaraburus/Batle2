import { _decorator, Component, Prefab, instantiate, Node } from 'cc';
import { FieldModel } from './FieldModel';
import { TileContollerListItem } from './TileContollerListItem';
const { ccclass, property } = _decorator;

/**
 * This class is need to build tiles of different types (prefabs)
 */
@ccclass('TileCreator')
export class TileCreator extends Component {
  private _fieldModel: FieldModel;

  @property(TileContollerListItem)
  tilePrefabs: TileContollerListItem[] = [];

  public setModel(fieldModel: FieldModel) {
    this._fieldModel = fieldModel;
  }

  public create(name: string): Node {
     let prefabs = this.tilePrefabs.filter(t => {
       let names = t.name.split(';');
       let haveResult = false;
       names.forEach((n => {
         if (n.trim() == name) {
           haveResult = true;
           return;
         }
       }));
 
       if (haveResult) {
         return true;
       }
 
       return false;
     });
 
     if (prefabs.length > 0) {
       return instantiate(prefabs[0].prefab);
     } else {
       return null;
     }

    return new Node();
  }
}


