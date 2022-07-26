import { _decorator, Component, Node, Vec2, CCInteger, Script, TextAsset } from 'cc';
import { TileModel } from '../tile/TileModel';
import { MnemonicMapping } from './MnemonicMapping';
const { ccclass, property } = _decorator;

/**
 * Represents game field model
 */
@ccclass('FieldModel')
export class FieldModel {

    /**
     * Tiles cols count
     */
    @property({ type: CCInteger })
    cols: number;

    /**
     * Tiles rows count
     */
    @property({ type: CCInteger })
    rows: number;

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
    @property({ type: [MnemonicMapping], visible: true, tooltip: "Tile mnemonic mapping" })
    mnemMapping: MnemonicMapping[] = [];

    /**
     * Get standart tile models
     * @returns collection of std tile models
     */
    public getStandartTiles(): TileModel[] {
        return this.tiles.filter(item => !item.SpecialTile)
    }

    /**
     * Gets tile model by type name
     * @param typeName Type name
     * @returns Tile model
     */
    public getTileModel(typeName: string): TileModel {
        return this.tiles.filter(item => item.Name == typeName)[0];
    }

    /**
    * Gets tile model by mapmnemonic
    * @param mnemonic Type name
    * @returns Tile model
    */
    public getTileModelByMapMnemonic(mnemonic: string): TileModel {
        let map = this.mnemMapping.filter(item => item.mnemonic == mnemonic);

        if (map.length == 0) {
            return this.tiles.filter(item => item.Name == mnemonic)[0];
        }

        let res = this.tiles.filter(item => item.Name == map[0].tileName)
        return res.length != 0 ? res[0] : this.tiles[0];
    }

    public getFieldMap(): string[][] {
        let result = [];

        const textLines = this.fieldMap.text.split(/\r?\n/);
        textLines.forEach((line, i) => {
            let iinv=textLines.length-i-1;
            result[iinv] = [];
            for (let j = 0; j < line.length; j++) {
                result[iinv][j] = line.charAt(j);
            }
        });
        return result;
    }
}