
import {
    _decorator,
    Sprite,
    Vec3,
    instantiate,
    Prefab,
    UITransform,
    randomRangeInt,
    tween,
    Vec2,
    Quat,
    assert,
} from "cc";
import { TileController } from "../TileController";
import { TileModel } from "../../../models/TileModel";
import { TileState } from "../TileState";
import { IAttackable, isIAttackable } from "../IAttackable";
import { GameManager } from "../../game/GameManager";
import { CardService } from "../../services/CardService";
import { PlayerModel } from "../../../models/PlayerModel";
import { FieldController } from "../../field/FieldController";
import { ObjectsCache } from "../../../ObjectsCache/ObjectsCache";
import { CardEffect } from "../../effects/CardEffect";
import { EffectsService } from "../../services/EffectsService";
import { ShootEffect } from "../../effects/ShootEffect";
import { Line } from "../../effects/Line";
import { ShootSmokeEffect } from "../../effects/shootSmokeEffect";
import { Service } from "../../services/Service";
const { ccclass, property } = _decorator;


@ccclass("WallTileController")
export class WallTileController extends TileController {
    start(): void {
        this.isFixed = true;
    }
}
