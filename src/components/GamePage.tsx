import { useEffect, useRef, useState } from "react";
import { Game } from "../injectables/game";
import { Box } from "@mui/material";

interface Inputs {
  game: Game;
}

const GamePage = ({ game }: Inputs) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const updateCanvasSize = () => {
    if (canvasRef.current) {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
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
    }
  }, [canvasSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      return;
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      game.render(canvas, ctx);
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <Box
      component="div"
      sx={{ height: "100%" }}
    >
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
    </Box>
  );
};

export default GamePage;
