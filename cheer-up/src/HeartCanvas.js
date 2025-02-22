// src/HeartCanvas.js
import React, { useEffect } from 'react';
import './Heart.css';
import { Canvas } from './Heart';

const HeartCanvas = () => {
  useEffect(() => {
    let canvas;
    let offCanvas;

    function init() {
      offCanvas = new Canvas(false);
      canvas = new Canvas(true);
      offCanvas.offInit();

      function render() {
        window.requestAnimationFrame(() => {
          canvas.render();
          render();
        });
      }
      render();

      window.addEventListener('resize', () => {
        canvas.resize();
        offCanvas.resize();
        offCanvas.offInit();
      });

      // Add console functions
      window.changeTextDelay = (newDelay) => {
        canvas.textDelay = newDelay;
      };

      window.addText = (newText) => {
        canvas.texts.push(newText);
      };

      window.changeVolume = (volume) => {
        canvas.audio.volume = volume;
      };

      window.toggleMusic = () => {
        if (canvas.audio.paused) {
          canvas.audio.play();
        } else {
          canvas.audio.pause();
        }
      };
    }

    window.addEventListener('load', init);

    return () => {
      window.removeEventListener('load', init);
    };
  }, []);

  return <div id="heart-canvas-container"></div>;
};

export default HeartCanvas;