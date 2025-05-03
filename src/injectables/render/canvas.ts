import { CanvasElement, RootElement, ZIndex } from "./canvaselement";
import { Position } from "./renderutil";

const DEBUG_MODE = true;

export class Canvas {
  public static rootElement?: RootElement;
  private static elements: CanvasElement[] = [];
  private static nonInteractiveElements: CanvasElement[] = [];
  private static currentHoverTarget?: CanvasElement;
  private static zOrderIsDirty: boolean = false;
  private static canvas?: HTMLCanvasElement;

  public static updateZIndex(e: CanvasElement, newZIndex: number) {
    if (newZIndex === ZIndex.NonInteractive) {
      const i = this.elements.indexOf(e);
      if (i > -1) {
        this.elements.splice(i, 1);
      }
      this.nonInteractiveElements.push(e);
      return; // we don't need to dirty in this case
    }
    if (e.zIndex === ZIndex.NonInteractive) {
      const i = this.nonInteractiveElements.indexOf(e);
      if (i > -1) {
        this.nonInteractiveElements.splice(i, 1);
      }
      this.elements.push(e);
    }
    this.dirtyZOrder();
  }

  public static dirtyZOrder() {
    this.zOrderIsDirty = true;
  }

  private static unDirtyZOrder() {
    if (this.zOrderIsDirty) {
      this.elements.sort((a, b) => b.zIndex - a.zIndex);
      this.elements.forEach((parent) =>
        parent.children.forEach((child) => {
          if (!parent.zIndex && parent.zIndex !== 0) {
            throw new Error("zIndex must be defined");
          }
          child.parent = parent;
        })
      );
      this.nonInteractiveElements.forEach((parent) =>
        parent.children.forEach((child) => {
          if (!parent.zIndex && parent.zIndex !== 0) {
            throw new Error("zIndex must be defined");
          }
          child.parent = parent;
        })
      );
      this.zOrderIsDirty = false;
    }
  }

  public static register(e: CanvasElement) {
    if (e.zIndex) {
      this.elements.push(e);
      this.dirtyZOrder();
    } else {
      this.nonInteractiveElements.push(e);
    }
  }

  public static bindToCanvas(canvas: HTMLCanvasElement) {
    if (this.canvas !== canvas) {
      this.canvas = canvas;
      this.canvas.addEventListener("mousemove", (event) => {
        const rect: DOMRect = canvas.getBoundingClientRect();
        this.handleCursorPosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      });
    }
  }

  private static handleCursorPosition(pos: Position) {
    this.unDirtyZOrder();
    let newHoverTarget = this.elements.find((e) => {
      if (!e.zIndex) {
        throw new Error(
          "NonInteractive element in CanvasEventHandler.elements"
        );
      }
      return !e.zIndex || e.contains(pos);
    });
    if (newHoverTarget?.zIndex === ZIndex.NonInteractive) {
      newHoverTarget = undefined;
    }

    if (newHoverTarget !== this.currentHoverTarget) {
      newHoverTarget?.handleMouseEnter(pos);
    }
    this.currentHoverTarget = newHoverTarget;
  }

  public static render() {
    const ctx = this.canvas?.getContext("2d");
    if (this.canvas && ctx && this.rootElement) {
      this.rootElement.update({
        x: 0,
        y: 0,
        w: this.canvas.width,
        h: this.canvas.height,
      });
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.renderElement(ctx, this.rootElement);
    }
  }

  public static renderElement(ctx: CanvasRenderingContext2D, e: CanvasElement) {
    ctx.save();
    ctx.translate(e.rd.x, e.rd.y);
    if (e.rd.rot) {
      ctx.rotate(e.rd.rot);
    }
    if (e.rd.scale !== 1) {
      ctx.scale(e.rd.scale, e.rd.scale);
    }
    if (e.rd.w && e.rd.h && e.rd.scale) {
      e.draw(ctx);
      if (DEBUG_MODE) {
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, e.rd.w, e.rd.h);
      }
    }
    e.children.forEach((child) => this.renderElement(ctx, child));
    ctx.restore();
  }
}
