import { _decorator, CCString, Component, Node } from "cc";
import { Service } from "../services/Service";
import { SettingsLoader } from "../services/SettingsLoader";
import { Grid } from "../ui/GridView/Grid";
import { LvlConfigGridRow } from "../ui/GridView/LvlConfigGridRow";
const { ccclass, property } = _decorator;

@ccclass("GameConfigurator")
export class GameConfigurator extends Service {
    private _settingsLoader: SettingsLoader;

    @property(Grid)
    grid: Grid;

    start() {
        this._settingsLoader = this.getServiceOrThrow(SettingsLoader);

        this.fillGrid();
    }

    reset() {
        this._settingsLoader.removeConfiguration();
    }

    fillGrid() {
        const config = this._settingsLoader.gameConfiguration;

        this.grid.rowCount = config.levels.length;
        this.grid.updateGrid();

        config.levels.forEach((v, i) => {

            const cfgRow = this.grid.rows[i].getComponent(LvlConfigGridRow);

            if (cfgRow) {
                cfgRow.lvlCfgRow = v;
            }
        });
    }

    public addRow() {
        this.grid.rowCount += 1;
        this.grid.updateGrid();
    }

    save() {
        const cfg = this._settingsLoader.gameConfiguration;
        cfg.levels = [];

        this.grid.rows.forEach(r => {
            const cfgRow = r.getComponent(LvlConfigGridRow);

            if (cfgRow) {
                cfg.levels.push(cfgRow.lvlCfgRow);
            }
        });

        this._settingsLoader.saveConfiguration();
    }
}
