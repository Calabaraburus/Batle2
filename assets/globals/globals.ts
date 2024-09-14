import { DEBUG } from "cc/env";

export const GAME_VERSION = "1.2.6.2"

export const GAME_DEBUG = false;

export function IN_DEBUG(): boolean {
    return GAME_DEBUG && DEBUG;
}