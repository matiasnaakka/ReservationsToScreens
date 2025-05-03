import { useEffect } from "react";

export const useAutoScroll = (ref, enabled, speed = 25, useRAF = true) => {
  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    const scrollStep = 1;
    const bottomThreshold = 2;

    let animationFrameId;
    let scrollDirection = "down";
    let paused = false;

    const pause = (duration) =>
      new Promise((resolve) => setTimeout(resolve, duration));

    const scroll = async () => {
      if (!element) return;

      while (enabled) {
        if (paused) {
          await pause(500); // Just wait while paused
          continue;
        }

        const atBottom =
          Math.ceil(element.scrollTop + element.clientHeight + bottomThreshold) >=
          element.scrollHeight;
        const atTop = element.scrollTop <= 0;

        if (scrollDirection === "down") {
          if (!atBottom) {
            element.scrollTop += scrollStep;
          } else {
            paused = true;
            await pause(2000); // Pause at bottom
            scrollDirection = "up";
            paused = false;
          }
        } else {
          if (!atTop) {
            element.scrollTop -= scrollStep;
          } else {
            paused = true;
            await pause(2000); // Pause at top
            scrollDirection = "down";
            paused = false;
          }
        }

        await pause(speed);
      }
    };

    if (useRAF) {
      let running = true;
      const loop = async () => {
        await scroll();
        if (running) animationFrameId = requestAnimationFrame(loop);
      };
      animationFrameId = requestAnimationFrame(loop);

      return () => {
        running = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      };
    } else {
      let intervalId = setInterval(scroll, speed);
      return () => clearInterval(intervalId);
    }
  }, [ref, enabled, speed, useRAF]);
};
