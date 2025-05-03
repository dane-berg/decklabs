import { CanvasElement, ZIndex } from "./canvaselement";
import { Position } from "./renderutil";

export class CanvasEventHandler {
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
      // TODO: make sure elements is always sorted descending
      this.elements.sort((a, b) => a.zIndex - b.zIndex);
      this.elements.forEach((parent) =>
        parent.children.forEach((child) => (child.parent = parent))
      );
      this.nonInteractiveElements.forEach((parent) =>
        parent.children.forEach((child) => (child.parent = parent))
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
    if (
      !(
        this.currentHoverTarget?.zIndex && this.currentHoverTarget.contains(pos)
      )
    ) {
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
        newHoverTarget?.handleMouseEnter?.(pos);
      }
      this.currentHoverTarget = newHoverTarget;
    }
  }
}
