const Directions = {
    RightBottom: 0,
    TopRight: 1,
    TopLeft: 2,
    BottomLeft: 3
};

class Hitter {
    constructor(elemCoordinates) {
        this.elemCoordinates = elemCoordinates;
    }

    get hitBotoom() {
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
            this[this.direction](step);

        }, speed);
    }


    get direction() {
        const hitter = new Hitter(this.elemCoordinates);

        if (this.currentDirection === Directions.RightBottom) {
            if (hitter.hitBotoom) {
                this.currentDirection = Directions.TopRight;
                return 'moveTopRight';
            }
            if (hitter.hitRight) {
                this.currentDirection = Directions.BottomLeft;
                return 'moveBottomLeft';
            }

            return 'moveRightBottom';
        }

        if (this.currentDirection === Directions.TopRight) {
            if (hitter.hitRight) {
                this.currentDirection = Directions.TopLeft;
                return 'moveTopLeft';
            }
            if (hitter.hitTop) {
                this.currentDirection = Directions.RightBottom;
                return 'moveRightBottom';
            }

            return 'moveTopRight';
        }

        if (this.currentDirection === Directions.TopLeft) {
            if (hitter.hitTop) {
                this.currentDirection = Directions.BottomLeft;
                return 'moveBottomLeft';
            }
            if (hitter.hitLeft) {
                this.currentDirection = Directions.TopRight;
                return 'moveTopRight';
            }

            return 'moveTopLeft';
        }

        if (this.currentDirection === Directions.BottomLeft) {
            if (hitter.hitLeft) {
                this.currentDirection = Directions.RightBottom;
                return 'moveRightBottom';
            }
            if (hitter.hitBotoom) {
                this.currentDirection = Directions.TopLeft;
                return 'moveTopLeft';
            }

            return 'moveBottomLeft';
        }

        
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



document.body.addEventListener('click', (event) => {
    const element = event.target;

    const screenSaver = new ScreenSaver(element, {
        speed: 10,
        step: 1
    });
    
    screenSaver.startMove();
});