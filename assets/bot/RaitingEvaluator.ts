import { PlayerModel } from "../models/PlayerModel";
import { TileController } from "../entities/tiles/TileController";
import { FieldControllerExtensions } from "../entities/field/FieldExtensions";
import { StdTileController } from "../entities/tiles/UsualTile/StdTileController";


export class RaitingEvaluator {

    private _tileAttackCoef = 20;
    private _fieldExt: FieldControllerExtensions;
    private _playerModel: PlayerModel;
    private _enemyModel: PlayerModel;
    private _playerBaseTiles: TileController[];
    private _enemyBaseTiles: TileController[];
    private _evaluationTileStrategies = new Map<string, (t: TileController, isEnemyTile: boolean) => number>();

    public constructor(fieldExt: FieldControllerExtensions, playerModel: PlayerModel, enemyModel: PlayerModel) {
        this._fieldExt = fieldExt;
        this._playerModel = playerModel;
        this._enemyModel = enemyModel;
        this._playerBaseTiles = fieldExt.findTilesByModelName("end");
        this._enemyBaseTiles = fieldExt.findTilesByModelName("start");

        this.fillEvaluations();
    }

    public set fieldExt(value: FieldControllerExtensions) {
        this._fieldExt = value;
    }

    public get fieldExt(): FieldControllerExtensions {
        return this._fieldExt;
    }

    fillEvaluations() {
        this._evaluationTileStrategies.set("mine", this.safePlaceEvStrategy.bind(this));
        this._evaluationTileStrategies.set("catapult", this.safePlaceEvStrategy.bind(this));
        this._evaluationTileStrategies.set("shaman", this.safePlaceEvStrategy.bind(this));

    }

    safePlaceEvStrategy(t: TileController, isEnemyTile: boolean): number {
        if (isEnemyTile) {
            return t.tileModel.dangerRating
        } else {
            return t.tileModel.dangerRating / (2 * (this.tileDangNeigboursCount(t) + 1));
        }
    }

    tileDangNeigboursCount(tile: TileController): number {
        const closestTiles = this._fieldExt.closest(tile);
        let count = 0;
        for (const tileInnr of closestTiles) {
            const c_count = this._fieldExt.countTilesOfSameGroup(this._fieldExt.closest(tileInnr), tileInnr.tileModel);

            if (c_count > 0) {
                count++;
            }
        }
        return count;
    }

    EvaluateRating(t: TileController, isEnemyTile: boolean) {
        if (t instanceof (StdTileController) && t.shieldIsActivated) {
            return 2;
        } else {
            if (this._evaluationTileStrategies.has(t.tileModel.tileName)) {
                const ev = this._evaluationTileStrategies.get(t.tileModel.tileName);
                if (ev) {
                    return ev(t, isEnemyTile);
                }
            }
        }

        return t.tileModel.dangerRating;
    }

    /**
     * @en Returns rating for game state
     */
    public getRating(): number {

        const playerTiles = this._fieldExt.getPlayerTiles(this._playerModel);
        const enemyTiles = this._fieldExt.getPlayerTiles(this._enemyModel);

        let result = 0;
        playerTiles.forEach((t) => {
            const distToEnemyBase = this._fieldExt.getVerticalDistance(t, this._enemyBaseTiles[0]);

            if (distToEnemyBase <= 1) {
                result += this._tileAttackCoef;
            }

            result += this.EvaluateRating(t, false);
        });

        const cccbant = this.countColumnCanBeAttackNextTurn(this._playerModel);

        result -= cccbant * (this._tileAttackCoef / 3)

        enemyTiles.forEach((t) => {
            const distToPlayerBase = this._fieldExt.getVerticalDistance(t, this._playerBaseTiles[0]);
            if (distToPlayerBase <= 1) {
                result -= this._tileAttackCoef;
            }

            result -= this.EvaluateRating(t, true);
        });

        return result;
    }

    private countColumnCanBeAttackNextTurn(playerModel: PlayerModel) {
        let res = 0;
        for (let index = 0; index < this._fieldExt.field.fieldMatrix.cols; index++) {
            if (this.isColumnHasDestructableTilesOfOneType(index, playerModel)) {
                res++;
            }
        }

        return res;
    }

    private isColumnHasDestructableTilesOfOneType(colId: number, playerModel: PlayerModel) {

        var tiles = this._fieldExt.field.fieldMatrix.filter((tile) => {
            if (tile instanceof StdTileController) {
                if (tile.playerModel == playerModel && tile.col == colId && !tile.shieldIsActivated) {
                    return true;
                }
            }
            return false;
        });

        if (tiles.length == 0) {
            return false;
        }

        const columnOneType = () => {
            const baseType = tiles[0].tileModel;

            for (const tile of tiles) {
                if (tile.tileModel != baseType) {
                    return false;
                }
            }

            return true;
        };

        if (tiles.length == 1) {
            const tCount = this._fieldExt.countTilesOfSameGroup(this._fieldExt.closest(tiles[0]), tiles[0].tileModel);
            return tCount > 0 ? true : false;
        } else if (tiles.length > 1 && columnOneType()) {
            return true;
        }

        return false;
    }
}


