//  ObjectCache - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras

import {
  _decorator,
  Component,
  instantiate,
  Node,
  __private,
  Prefab,
  js,
} from "cc";
import { CacheObject } from "./CacheObject";
import { ICacheObject } from "./ICacheObject";
import { IObjectsCache } from "./IObjectsCache";
const { ccclass, property } = _decorator;

/**
 * This class is need to build tiles of different types (prefabs)
 */
@ccclass("ObjectsCache")
export class ObjectsCache extends Component implements IObjectsCache {
  private static _instance: ObjectsCache | null = null;
  public static get instance(): ObjectsCache | null {
    return this._instance;
  }

  private _nodes: Node[] | null = null;

  private _objectBags: Map<string, CacheBag> = new Map<string, CacheBag>();

  @property(Prefab)
  prefabs: Prefab[] = [];

  onLoad() {
    ObjectsCache._instance = this;
  }

  prefabsToNodes() {
    if (this._nodes == null) {
      this._nodes = [];

      this.prefabs.forEach((p) => {
        const instance = instantiate(p);
        if (this._nodes != null) {
          this._nodes.push(instance);
        }
      });
    }
  }

  public getObject<T extends ICacheObject>(
    classConstructor: __private._types_globals__Constructor<T>
  ): T | null | undefined {
    return this.getObjectByName(classConstructor.name);
  }

  public getObjectByName<T extends ICacheObject>(
    typeName: string
  ): T | null | undefined {
    this.prefabsToNodes();
    let bag: CacheBag | null | undefined = null;

    if (this._objectBags.has(typeName)) {
      bag = this._objectBags.get(typeName);
    } else {
      this._nodes?.forEach((n, i) => {
        if (
          n.components.find((c) => js.getClassName(c) == typeName) !== undefined
        ) {
          bag = new CacheBag();
          bag.prefab = this.prefabs[i];
          this._objectBags.set(typeName, bag);
          return;
        }
      });
    }

    const result = bag?.get();
    result?.cacheCreate();
    return result as T | null | undefined;
  }

  public getObjectByPrefabName<T extends ICacheObject>(
    prefabName: string
  ): T | null | undefined {
    this.prefabsToNodes();
    let bag: CacheBag | null | undefined = null;

    if (this._objectBags.has("p_" + prefabName)) {
      bag = this._objectBags.get("p_" + prefabName);
    } else {
      this.prefabs?.forEach((p, i) => {
        if (p.name == prefabName) {
          bag = new CacheBag();
          bag.prefab = p;
          this._objectBags.set("p_" + prefabName, bag);
          return;
        }
      });
    }

    const result = bag?.get();
    result?.cacheCreate();
    return result as T | null | undefined;
  }
}

class CacheBag {
  public prefab: Prefab;
  public bagNotDestroied: Set<CacheObject> = new Set<CacheObject>();
  public bagDestroied: Set<CacheObject> = new Set<CacheObject>();

  public get(): CacheObject | null | undefined {
    if (this.bagDestroied.size == 0) {
      const obj = instantiate(this.prefab);
      const result = obj.getComponent(CacheObject);

      if (result == null) {
        return null;
      }

      this.bagNotDestroied.add(result);

      result?.destroyEvent.on("destroy_object", (obj: CacheObject) => {
        this.bagNotDestroied.delete(obj);
        this.bagDestroied.add(obj);
      });

      return result;
    } else {
      const result = this.bagDestroied.values().next().value;
      this.bagDestroied.delete(result);
      this.bagNotDestroied.add(result);
      return result;
    }
  }
}
