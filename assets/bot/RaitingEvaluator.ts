import { PlayerModel } from "../models/PlayerModel";
import { TileController } from "../entities/tiles/TileController";
import { FieldControllerExtensions } from "../entities/field/FieldExtensions";
import { StdTileController } from "../entities/tiles/UsualTile/StdTileController";


export class RaitingEvaluator {

    private _tileAttackCoef = 10;
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

        enemyTiles.forEach((t) => {
            const distToPlayerBase = this._fieldExt.getVerticalDistance(t, this._playerBaseTiles[0]);
            if (distToPlayerBase <= 1) {
                result -= this._tileAttackCoef;
            }

            result -= this.EvaluateRating(t, true);
        });

        return result;
    }
}


