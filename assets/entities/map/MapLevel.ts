import { _decorator, Component, Node } from 'cc';
import { Service } from '../services/Service';
import { SettingsLoader } from '../services/SettingsLoader';
import { MapController } from './MapController';
import { PlayerCurrentGameState } from '../services/PlayerCurrentGameState';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('MapLevel')
export class MapLevel extends Service {
    private _settingsLoader: SettingsLoader;


    @property(MapController)
    mapConstroller: MapController;
    private _playerState: PlayerCurrentGameState;

    start(): void {
        this._settingsLoader = this.getServiceOrThrow(SettingsLoader);
        this._settingsLoader.loadPlayerCurrentGameState();
        this._playerState = this._settingsLoader.playerCurrentGameState;
        // this._settingsLoader.removePlayerCurrentGameState();

        this.initMap();
    }

    initMap() {
        this.mapConstroller.activateAll(false);
        // this.mapConstroller.activateLvlObjectByKey('lvl1');
        // const lvlobj = this.mapConstroller.getLvlObject('lvl2');
        // if (lvlobj) lvlobj.levelButtonNode.active = true;
        const fl = this._playerState.finishedLevels;

        fl.forEach(lvl => this.activateLvl(lvl));
        const nextLvlId = fl.length > 0 ?
            Number(fl[fl.length - 1].replace('lvl', '')) + 1 :
            1;

        const nextLvl = this.mapConstroller.getLvlObject(`lvl${nextLvlId}`);

        if (nextLvl) {
            nextLvl.levelButtonNode.active = true;
            this.mapConstroller.setCurrent(nextLvl);
        }
    }

    activateLvl(lvlName: string) {
        //        const lvl = this.mapConstroller.getLvlObject(lvlName);
        this.mapConstroller.activateLvlObjectByKey(lvlName);
    }

}
