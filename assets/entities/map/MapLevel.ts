import { _decorator, Component, Node } from 'cc';
import { Service } from '../services/Service';
import { SettingsLoader } from '../services/SettingsLoader';
import { MapController } from './MapController';
import { PlayerCurrentGameState } from '../services/PlayerCurrentGameState';
import { AudioConfigurator } from '../services/AudioConfigurator';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('MapLevel')
export class MapLevel extends Service {
    private _settingsLoader: SettingsLoader;


    @property(MapController)
    mapConstroller: MapController;
    private _playerState: PlayerCurrentGameState;
    private _audioConfig: AudioConfigurator;

    start(): void {
        this._settingsLoader = this.getServiceOrThrow(SettingsLoader);
        this._settingsLoader.loadPlayerCurrentGameState();
        this._audioConfig = this.getServiceOrThrow(AudioConfigurator);
        this._playerState = this._settingsLoader.playerCurrentGameState;
        // this._settingsLoader.removePlayerCurrentGameState();
        this._audioConfig.applyList(this._audioConfig.mapMusicList);
        this.initMap();
    }

    updateMap() {
        this._playerState = this._settingsLoader.playerCurrentGameState;
        this.initMap();
    }

    initMap() {
        this.mapConstroller.activateAll(false);

        const fl = this._playerState.finishedLevels;

        fl.forEach(lvl => this.activateLvl(lvl));

        const lids = fl.map(lvl => Number(lvl.replace('lvl', ''))).filter(id => !Number.isNaN(id));

        const nextLvlId = lids.length > 0 ? Math.max(...lids) + 1 : 1;

        const nextLvl = this.mapConstroller.getLvlObject(`lvl${nextLvlId}`);

        if (nextLvl) {
            nextLvl.levelButtonNode.active = true;
            this.mapConstroller.setCurrent(nextLvl);
        }
    }

    activateLvl(lvlName: string) {
        this.mapConstroller.activateLvlObjectByKey(lvlName);
    }

}
