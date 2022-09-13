const Directions = {
  RightBottom: 'moveRightBottom',
  TopRight: 'moveTopRight',
  TopLeft: 'moveTopLeft',
  BottomLeft: 'moveBottomLeft'
};


const DirectionsSettings = {
  [Directions.RightBottom]: hitter => {
    if (hitter.hitBottom) {
      return Directions.TopRight;
    }
    if (hitter.hitRight) {
      return Directions.BottomLeft;
    }
    return Directions.RightBottom;
  },
  [Directions.TopRight]: hitter => {
    if (hitter.hitRight) {
      return Directions.TopLeft;
    }
    if (hitter.hitTop) {
      return Directions.RightBottom;
    }
    return Directions.TopRight;
  },
  [Directions.TopLeft]: hitter => {
    if (hitter.hitTop) {
      return Directions.BottomLeft;
    }
    if (hitter.hitLeft) {
      return Directions.TopRight;
    }
    return Directions.TopLeft;
  },
  [Directions.BottomLeft]: hitter => {
    if (hitter.hitLeft) {
      return Directions.RightBottom;
    }
    if (hitter.hitBottom) {
      return Directions.TopLeft;
    }
    return Directions.BottomLeft;
  }
}

class Hitter {
  constructor(elemCoordinates) {
    this.elemCoordinates = elemCoordinates;
  }

  get hitBottom() {
    return this.elemCoordinates.bottom >= window.innerHeight;
  }

  get hitRight() {
    return this.elemCoordinates.right >= window.innerWidth;
  }

  get hitTop() {
    return this.elemCoordinates.top <= 0;
  }

  get hitLeft() {
    return this.elemCoordinates.left <= 0;
  }
}

class ScreenSaver {
  constructor(element, options) {
    this.element = element;
    this.options = options;
  }

  interval;

  coordinatesToMove = [0, 0];

  currentDirection = Directions.RightBottom;

  get elemCoordinates() {
    return this.element.getBoundingClientRect();
  }

  startMove() {
    const {speed, step} = this.options;
    this.interval = setInterval(() => {
      this.currentDirection = this.direction;
      this[this.currentDirection](step);

    }, speed);

  }

  stopMove() {
    clearInterval(this.interval);
  }

  get direction() {
    return DirectionsSettings[this.currentDirection](new Hitter(this.elemCoordinates));
  }

  moveRightBottom(step) {
    this.move(([x, y]) => [x + step, y + step]);
  }

  moveTopRight(step) {
    this.move(([x, y]) => [x + step, y - step]);
  }

  moveTopLeft(step) {
    this.move(([x, y]) => [x - step, y - step]);
  }

  moveBottomLeft(step) {
    this.move(([x, y]) => [x - step, y + step]);
  }

  move(increaseCoordinates) {
    let [x, y] = increaseCoordinates(this.coordinatesToMove);

    this.coordinatesToMove = [x, y];

    this.element.style.transform = `translate(${x}px, ${y}px)`;
  }
}

class ScreenSaverRunner {
  elements = [];

  constructor(speed, step) {
    this.speed = speed;
    this.step = step;
  }

  run() {
    document.body.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const element = event.target;

      if (!this.elements.includes(element)) {
        const screenSaver = this.createScreenSaver(element);

        screenSaver.startMove();
        if (this.elements.includes(element)) {
          this.elements.forEach(() => {
            element.addEventListener('click', () => {
              screenSaver.stopMove();
            });
          });
         }
      } 
    });
  }

  createScreenSaver(element) {
    this.elements.push(element);

    return new ScreenSaver(element, {
      speed: this.speed,
      step: this.step
    });
  }
}


const runner = new ScreenSaverRunner(10, 1);

runner.run();


