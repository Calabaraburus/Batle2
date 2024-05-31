import { DEBUG } from "cc/env";

export const GAME_DEBUG = true;

export function IN_DEBUG(): boolean {
    return GAME_DEBUG && DEBUG;
}