import { Vec3 } from 'cc';
import { TileModel } from '../../models/TileModel';

export interface CreateTileArgs {
  row: number;
  col: number;
  tileModel: TileModel;
  position?: Vec3 | null;
  putOnField?: boolean;
}
