import { _decorator, Component, Node, settings } from 'cc';
import { Service } from '../services/Service';
import { SettingsLoader } from '../services/SettingsLoader';
import { MapController } from './MapController';
import { PlayerCurrentGameState } from '../services/PlayerCurrentGameState';
import { AudioConfigurator } from '../services/AudioConfigurator';
import { StartLevelWindow } from '../ui/window/StartLevelWindow';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('MapLevel')
export class MapLevel extends Service {
    private _settingsLoader: SettingsLoader;

    @property(MapController)
    mapConstroller: MapController;
    private _playerState: PlayerCurrentGameState;
    private _audioConfig: AudioConfigurator;
    private _strtWnd: StartLevelWindow;

    start(): void {
        this._settingsLoader = this.getServiceOrThrow(SettingsLoader);
        this._settingsLoader.loadPlayerCurrentGameState();
        this._audioConfig = this.getServiceOrThrow(AudioConfigurator);
        this._strtWnd = this.getServiceOrThrow(StartLevelWindow);
        this._audioConfig.applyList(this._audioConfig.mapMusicList);
        this.updateMap();
    }

    updateMap() {
        this._playerState = this._settingsLoader.playerCurrentGameState;
        this.initMap();
        this.execEvents();
    }

    execEvents() {
        if (this._playerState.eventExists('intro')) {
            this._strtWnd.showWindow(null, "scroll:intro");
            this._playerState.removeEvent('intro');

            this._settingsLoader.saveGameState();
        }

        if (this._playerState.eventExists('ending') && this._playerState.isGameFinished()) {
            this._strtWnd.showWindow(null, "scroll:ending");
            this._playerState.removeEvent('ending');

            this._settingsLoader.saveGameState();
        }
    }



    initMap() {
        this.mapConstroller.activateAll(false);

        const fl = this._playerState.finishedLevels;

        fl.forEach(lvl => this.activateLvl(lvl));

        this.activateLvl('lvl0');

        const lids = fl.map(lvl => Number(lvl.replace('lvl', ''))).filter(id => !Number.isNaN(id));

        const maxLvlId = Math.max(...lids);
        const nextLvlId = lids.length > 0 ? maxLvlId + 1 : 1;

        const nextLvl = this.mapConstroller.getLvlObject(`lvl${nextLvlId}`);

        if (nextLvl) {
            if (!this.mapConstroller.marker.active) this.mapConstroller.marker.active = true;
            nextLvl.levelButtonNode.active = true;
            this.mapConstroller.setCurrent(nextLvl);
        } else {
            this.mapConstroller.marker.active = false;
            const mlvl = this.mapConstroller.getLvlObject(`lvl${maxLvlId}`);
            if (mlvl) this.mapConstroller.setCurrent(mlvl);
        }
    }

    activateLvl(lvlName: string) {
        this.mapConstroller.activateLvlObjectByKey(lvlName);
    }

}
