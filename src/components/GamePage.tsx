import { useEffect, useRef, useState } from "react";
import { Game } from "../injectables/game/game";
import { Box } from "@mui/material";
import { Canvas } from "../injectables/render/canvas";
import { GameElement } from "../injectables/game/gameelement";

interface Inputs {
  game: Game;
}

const GamePage = ({ game }: Inputs) => {
  const [errorString, setErrorString] = useState<String | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const updateCanvasSize = () => {
    if (canvasRef.current) {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    } else {
      setErrorString("!canvasRef.current when initializing canvas size");
    }
  };

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
    } else {
      setErrorString("!canvasRef.current when updating canvas size");
    }
  }, [canvasSize]);

  useEffect(() => {
    Canvas.rootElement = new GameElement(game);
    const animate = () => {
      canvasRef.current && Canvas.bindToCanvas(canvasRef.current);
      Canvas.render();
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <Box
      component="div"
      sx={{ height: "100%" }}
    >
      {errorString ? (
        <div>{errorString}</div>
      ) : (
        <>
          <img
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            src="parchment.jpg"
          ></img>
          <canvas
            style={{
              position: "absolute",
              width: canvasSize.width,
              height: canvasSize.height,
              objectFit: "contain",
            }}
            ref={canvasRef}
          ></canvas>
        </>
      )}
    </Box>
  );
};

export default GamePage;
