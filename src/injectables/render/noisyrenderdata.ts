import { Configure } from "../configure";
import {
  TransformData,
  randNoise,
  add,
  scale,
  isTransformData,
} from "./renderutil";

export const NOISE_DURATION = 300; // frames

export class NoisytransformData {
  public transformData: Partial<TransformData> = {};
  public noiseTimeout: number = Math.random() * NOISE_DURATION;
  public noiseA: TransformData = { x: 0, y: 0, rot: 0, scale: 0 };
  public noiseB: TransformData = this.newNoise();

  public newNoise(): TransformData {
    return {
      x: randNoise(0.02),
      y: randNoise(0.02),
      rot: randNoise(0.02),
      scale: randNoise(0.01),
    };
  }

  public update(
    newData: TransformData,
    smoothing: number = Configure.ANIMATION_SMOOTHING
  ) {
    // update noise
    this.noiseTimeout += 1;
    if (this.noiseTimeout >= NOISE_DURATION) {
      this.noiseTimeout = 0;
      this.noiseA = this.noiseB;
      this.noiseB = this.newNoise();
    }

    // update actual render data
    const currentData: TransformData = { ...newData, ...this.transformData };
    this.transformData = add(
      scale(currentData, smoothing),
      scale(newData, 1 - smoothing)
    );
  }

  public getCurrentData(ignoreNoise: boolean = false): TransformData {
    if (!isTransformData(this.transformData)) {
      throw new Error(
        "RenderData must be defined for NoisyRenderData.getCurrentData"
      );
    }
    if (ignoreNoise) {
      return this.transformData;
    }
    const t: number = this.noiseTimeout / NOISE_DURATION;
    return add(
      this.transformData,
      add(scale(this.noiseB, t), scale(this.noiseA, 1 - t))
    );
  }

  public clear() {
    this.transformData.x = undefined;
    this.transformData.y = undefined;
    this.transformData.rot = undefined;
    this.transformData.scale = undefined;
  }
}
