import { TransformData, randNoise, add, scale } from "./renderutil";

export const NOISE_DURATION = 300; // frames

export class NoisyTransformData {
  public noiseTimeout: number = Math.random() * NOISE_DURATION;
  public noiseA: TransformData = this.newNoise();
  public noiseB: TransformData = this.newNoise();

  public newNoise(): TransformData {
    return {
      x: randNoise(),
      y: randNoise(),
      rot: randNoise(),
      scale: randNoise(0.5),
    };
  }

  public update() {
    // update noise target
    this.noiseTimeout += 1;
    if (this.noiseTimeout >= NOISE_DURATION) {
      this.noiseTimeout = 0;
      this.noiseA = this.noiseB;
      this.noiseB = this.newNoise();
    }
  }

  public getCurrentData(): TransformData {
    const t: number = this.noiseTimeout / NOISE_DURATION;
    return add(scale(this.noiseB, t), scale(this.noiseA, 1 - t));
  }
}
