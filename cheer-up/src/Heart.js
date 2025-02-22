// src/Heart.js
class Tool {
  static randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  static randomColorRGB() {
    return `rgb(${this.randomNumber(0, 255)}, ${this.randomNumber(0, 255)}, ${this.randomNumber(0, 255)})`;
  }
  static randomColorHSL(hue, saturation, lightness) {
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
  static gradientColor(ctx, cr, cg, cb, ca, x, y, r) {
    const col = `${cr},${cg},${cb}`;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${col}, ${ca * 1})`);
    g.addColorStop(0.5, `rgba(${col}, ${ca * 0.5})`);
    g.addColorStop(1, `rgba(${col}, ${ca * 0})`);
    return g;
  }
}

class Angle {
  constructor(a) {
    this.a = a;
    this.rad = (this.a * Math.PI) / 180;
  }
  incDec(num) {
    this.a += num;
    this.rad = (this.a * Math.PI) / 180;
  }
}

class Canvas {
  constructor(bool) {
    this.canvas = document.createElement('canvas');
    if (bool === true) {
      this.canvas.style.position = 'relative';
      this.canvas.style.display = 'block';
      this.canvas.style.top = 0;
      this.canvas.style.left = 0;
      document.body.appendChild(this.canvas);
    }
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.width < 768 ? (this.heartSize = 180) : (this.heartSize = 250);
    this.mouseX = null;
    this.mouseY = null;
    this.hearts = [];
    this.offHeartNum = 1;
    this.offHearts = [];
    this.data = null;
    this.texts = [
      'My girl, my girl, my girl',
      'You will be',
      'My girl, my girl, my girl',
      'You will be',
      'My girl, my girl, my girl',
    ]; // Array of texts
    this.currentTextIndex = 0; // Index of the current text
    this.currentText = ''; // Current text for typing effect
    this.textIndex = 0; // Index of the current character
    this.textDelay = 100; // Delay between characters (in milliseconds)
    this.textAlpha = 1; // Text transparency
    this.isFadingOut = false; // Flag for text fading out
    this.isTyping = false; // Flag for typing text
    this.isFinished = false; // Flag for finishing all texts
    this.isDelayed = false; // Flag for delay before starting
    this.audio = new Audio(); // Create audio object
    this.loadAudio(); // Load audio
  }

  loadAudio() {
    this.audio.src = '/assets/my.mp3'; // Specify the path to your music file
    this.audio.loop = true; // Enable music looping
    this.audio.volume = 0.5; // Set volume (from 0 to 1)
    this.audio.play().catch((error) => {
      console.error('Error playing audio:', error);
    });
  }

  onInit() {
    let index = 0;
    for (let i = 0; i < this.height; i += 12) {
      for (let j = 0; j < this.width; j += 12) {
        let oI = (j + i * this.width) * 4 + 3;
        if (this.data[oI] > 0) {
          index++;
          const h = new Heart(
            this.ctx,
            j + Tool.randomNumber(-3, 3),
            i + Tool.randomNumber(-3, 3),
            Tool.randomNumber(6, 12),
            index
          );
          this.hearts.push(h);
        }
      }
    }
  }

  offInit() {
    for (let i = 0; i < this.offHeartNum; i++) {
      const s = new Heart(this.ctx, this.width / 2, this.height / 2.3, this.heartSize);
      this.offHearts.push(s);
    }
    for (let i = 0; i < this.offHearts.length; i++) {
      this.offHearts[i].offRender(i);
    }
    this.data = this.ctx.getImageData(0, 0, this.width, this.height).data;
    this.onInit();
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (let i = 0; i < this.hearts.length; i++) {
      this.hearts[i].render(this);
    }
    if (!this.isDelayed) {
      this.startDelay(); // Start delay
    } else if (!this.isFinished) {
      this.drawText(); // Draw text
      this.typeWriterEffect(); // Typing effect
      this.fadeText(); // Text fading animation
    }
  }

  startDelay() {
    setTimeout(() => {
      this.isDelayed = true; // Start typing after delay
      this.isTyping = true; // Allow typing
    }, 19000); // 19 seconds delay
  }

  drawText() {
    const ctx = this.ctx;
    ctx.save();
    ctx.font = 'italic bold 24px Arial'; // Italic font
    ctx.fillStyle = `rgba(255, 0, 0, ${this.textAlpha})`; // Text color with transparency
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.currentText, this.width / 2, this.height - 50); // Text position
    ctx.restore();
  }

  typeWriterEffect() {
    if (!this.isFadingOut && this.isTyping && this.textIndex < this.texts[this.currentTextIndex].length) {
      this.currentText += this.texts[this.currentTextIndex][this.textIndex];
      this.textIndex++;
      setTimeout(() => {}, this.textDelay); // Delay between characters
    } else if (!this.isFadingOut && this.textIndex >= this.texts[this.currentTextIndex].length) {
      this.isTyping = false; // Finish typing
      setTimeout(() => {
        this.isFadingOut = true; // Start fading out
      }, 1000); // Wait a second before fading out
    }
  }

  fadeText() {
    if (this.isFadingOut) {
      this.textAlpha -= 0.02; // Decrease transparency
      if (this.textAlpha <= 0) {
        this.textAlpha = 0;
        this.isFadingOut = false; // Finish fading out
        if (this.currentTextIndex < this.texts.length - 1) {
          this.currentTextIndex++; // Move to the next text
          this.currentText = ''; // Reset current text
          this.textIndex = 0; // Reset character index
          this.isTyping = true; // Start typing new text
          this.textAlpha = 1; // Restore transparency
        } else {
          this.isFinished = true; // All texts finished
        }
      }
    }
  }

  resize() {
    this.offHearts = [];
    this.hearts = [];
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.width < 768 ? (this.heartSize = 180) : (this.heartSize = 250);
  }
}

class Heart {
  constructor(ctx, x, y, r, i) {
    this.ctx = ctx;
    this.init(x, y, r, i);
  }

  init(x, y, r, i) {
    this.x = x;
    this.xi = x;
    this.y = y;
    this.yi = y;
    this.r = r;
    this.i = i * 0.5 + 200;
    this.l = this.i;
    this.c = Tool.randomColorHSL(Tool.randomNumber(-5, 5), 80, 60);
    this.a = new Angle(Tool.randomNumber(0, 360));
    this.v = {
      x: Math.random(),
      y: -Math.random(),
    };
    this.ga = Math.random();
  }

  draw() {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = this.ga;
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.moveTo(this.x, this.y + this.r);
    ctx.bezierCurveTo(
      this.x - this.r - this.r / 5,
      this.y + this.r / 1.5,
      this.x - this.r,
      this.y - this.r,
      this.x,
      this.y - this.r / 5
    );
    ctx.bezierCurveTo(
      this.x + this.r,
      this.y - this.r,
      this.x + this.r + this.r / 5,
      this.y + this.r / 1.5,
      this.x,
      this.y + this.r
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  updateParams() {
    this.a.incDec(1);
    Math.sin(this.a.rad) < 0 ? (this.r = -Math.sin(this.a.rad) * 20) : (this.r = Math.sin(this.a.rad) * 20);
  }

  updatePosition() {
    this.l -= 1;
    if (this.l < 0) {
      this.v.y -= 0.01;
      this.v.x += 0.02;
      this.y += this.v.y;
      this.x += this.v.x;
    }
  }

  wrapPosition(canvas) {
    if (this.x > canvas.width * 1.5) {
      this.init(this.xi, this.yi, Tool.randomNumber(6, 12), this.i);
    }
  }

  render(canvas) {
    this.wrapPosition(canvas);
    this.updateParams();
    this.updatePosition();
    this.draw();
  }

  offRender(i) {
    this.draw();
  }
}

export { Tool, Angle, Canvas, Heart };