//  FieldModel.ts - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras

import {
  _decorator,
  Component,
  CCInteger,
  CCFloat,
  TextAsset,
  Button,
} from "cc";
import { TileModel } from "./TileModel";
import { MnemonicMapping } from "./MnemonicMapping";
const { ccclass, property } = _decorator;

/**
 * Represents game field model. This model contains field metadata
 */
@ccclass("FieldModel")
export class FieldModel extends Component {
  /**
   * Tiles cols count
   */
  @property({ type: CCInteger })
  cols = 15;

  /**
   * Tiles rows count
   */
  @property({ type: CCInteger })
  rows = 15;

  /**
   * Tile margin
   */
  @property({ type: CCFloat })
  border = 0.1;

  /**
   * Quantity of tiles to create rocket
   */
  @property({ type: CCInteger })
  quantityToRocket = 5;

  /**
   * Quantity of tiles to create bomb
   */
  @property({ type: CCInteger })
  quantityToBomb = 8;

  /**
   * Quantity of tiles to create star
   */
  @property({ type: CCInteger })
  quantityToStar = 11;

  /**
   * Tile model collection
   */
  @property({ type: [TileModel], visible: true, tooltip: "Tile models" })
  tiles: TileModel[] = [];

  /**
   * Field map
   */
  @property({ type: [TextAsset], visible: true, tooltip: "Field map" })
  fieldMap: TextAsset;

  /**
   * Tile mnemonic mapping
   */
  @property({
    type: [MnemonicMapping],
    visible: true,
    tooltip: "Tile mnemonic mapping",
  })
  mnemMapping: MnemonicMapping[] = [];

  /**
   * Get standart tile models
   * @returns collection of std tile models
   */
  public getStandartTiles(): TileModel[] {
    return this.tiles.filter((item) => !item.specialTile);
  }

  /**
   * Gets tile model by type name
   * @param typeName Type name
   * @returns Tile model
   */
  public getTileModel(typeName: string): TileModel {
    return this.tiles.filter((item) => item.tileName == typeName)[0];
  }

  /**
   * Gets tile model by mapmnemonic
   * @param mnemonic Type name
   * @returns Tile model
   */
  public getTileModelByMapMnemonic(mnemonic: string): TileModel {
    const map = this.mnemMapping.filter((item) => item.mnemonic == mnemonic);

    if (map.length == 0) {
      return this.tiles.filter((item) => item.tileName == mnemonic)[0];
    }
    Button;

    const res = this.tiles.filter((item) => item.tileName == map[0].tileName);
    return res.length != 0 ? res[0] : this.tiles[0];
  }

  public getFieldMap(): string[][] {
    const result = [];

    const textLines = this.fieldMap.text.split(/\r?\n/);
    textLines.forEach((line, i) => {
      const iinv = textLines.length - i - 1;
      result[iinv] = [];
      for (let j = 0; j < line.length; j++) {
        result[iinv][j] = line.charAt(j);
      }
    });
    return result;
  }
}
