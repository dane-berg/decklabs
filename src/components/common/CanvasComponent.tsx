import { useEffect, useRef, useState } from "react";
import { RootElement } from "../../injectables/render/canvaselement";
import { Canvas } from "../../injectables/render/canvas";

interface Inputs {
  width?: number | string;
  height?: number | string;
  backgroundImg?: string;
  rootElement?: RootElement;
}

const CanvasComponent = ({
  width,
  height,
  backgroundImg,
  rootElement,
}: Inputs) => {
  const [errorString, setErrorString] = useState<String | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement | undefined>(undefined);
  const [canvasSize, setCanvasSize] = useState<
    { width: number; height: number } | undefined
  >(undefined);
  const divRef = useRef<HTMLDivElement | undefined>(undefined);

  function updateCanvasSize() {
    if (!divRef.current) {
      setErrorString("!divRef.current when updating canvas size");
      return;
    }
    if (!canvasRef.current) {
      setErrorString("!canvasRef.current when updating canvas size");
      return;
    }
    const newSize = divRef.current.getBoundingClientRect();
    setCanvasSize(newSize);
    canvasRef.current.width = newSize.width;
    canvasRef.current.height = newSize.height;
  }

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  useEffect(() => {
    const animate = () => {
      Canvas.rootElement = rootElement;
      canvasRef.current && Canvas.bindToCanvas(canvasRef.current);
      Canvas.render();
      requestAnimationFrame(animate);
    };
    animate();
  }, [rootElement]);

  return errorString ? (
    <div style={{ width: width ?? "100%", height: height ?? "100%" }}>
      {errorString}
    </div>
  ) : (
    <div
      style={{ width: width ?? "100%", height: height ?? "100%" }}
      ref={divRef}
    >
      {backgroundImg && (
        <img
          style={{
            width: canvasSize?.width,
            height: canvasSize?.height,
            position: "absolute",
            objectFit: "cover",
          }}
          src={backgroundImg}
        />
      )}
      <canvas
        style={{
          ...canvasSize,
          position: "absolute",
          objectFit: "contain",
        }}
        ref={canvasRef}
      ></canvas>
    </div>
  );
};

export default CanvasComponent;
