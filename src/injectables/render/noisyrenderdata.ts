import { Configure } from "../configure";
import { RenderData, randNoise, add, scale, isRenderData } from "./renderutil";

export const NOISE_DURATION = 300; // frames

export class NoisyRenderData {
  public renderData: Partial<RenderData> = {};
  public noiseTimeout: number = Math.random() * NOISE_DURATION;
  public noiseA: RenderData = { x: 0, y: 0, rot: 0, scale: 0 };
  public noiseB: RenderData = this.newNoise();

  public newNoise(): RenderData {
    return {
      x: randNoise(0.02),
      y: randNoise(0.02),
      rot: randNoise(0.02),
      scale: randNoise(0.01),
    };
  }

  public update(
    newData: RenderData,
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
    const currentData: RenderData = { ...newData, ...this.renderData };
    this.renderData = add(
      scale(currentData, smoothing),
      scale(newData, 1 - smoothing)
    );
  }

  public getCurrentData(): RenderData {
    if (!isRenderData(this.renderData)) {
      throw new Error(
        "RenderData must be defined for NoisyRenderData.getCurrentData"
      );
    }
    const t: number = this.noiseTimeout / NOISE_DURATION;
    return add(
      this.renderData,
      add(scale(this.noiseB, t), scale(this.noiseA, 1 - t))
    );
  }

  public clear() {
    this.renderData.x = undefined;
    this.renderData.y = undefined;
    this.renderData.rot = undefined;
    this.renderData.scale = undefined;
  }
}
