const Directions = {
    RightBottom: 0,
    TopRight: 1,
    TopLeft: 2,
    BottomLeft: 3
};


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
        const cords = this.elemCoordinates;

        if (this.currentDirection === Directions.RightBottom) {
            if (cords.bottom >= window.innerHeight) {
                this.currentDirection = Directions.TopRight;
                return 'moveTopRight';
            }
            if (cords.right >= window.innerWidth) {
                this.currentDirection = Directions.BottomLeft;
                return 'moveBottomLeft';
            }

            return 'moveRightBottom';
        }

        if (this.currentDirection === Directions.TopRight) {
            if (cords.right >= window.innerWidth) {
                this.currentDirection = Directions.TopLeft;
                return 'moveTopLeft';
            }
            if (cords.top <= 0) {
                this.currentDirection = Directions.RightBottom;
                return 'moveRightBottom';
            }

            return 'moveTopRight';
        }

        if (this.currentDirection === Directions.TopLeft) {
            if (cords.top <= 0) {
                this.currentDirection = Directions.BottomLeft;
                return 'moveBottomLeft';
            }
            if (cords.left <= 0) {
                this.currentDirection = Directions.TopRight;
                return 'moveTopRight';
            }

            return 'moveTopLeft';
        }

        if (this.currentDirection === Directions.BottomLeft) {
            if (cords.left <= 0) {
                this.currentDirection = Directions.RightBottom;
                return 'moveRightBottom';
            }
            if (cords.bottom >= window.innerHeight) {
                this.currentDirection = Directions.TopLeft;
                return 'moveTopLeft';
            }

            return 'moveBottomLeft';
        }

        
    }

    moveRightBottom(step) {
        let [x, y] = this.coordinatesToMove;

        x = x + step;
        y = y + step;

        this.coordinatesToMove = [x, y];

        this.element.style.transform = `translate(${x}px, ${y}px)`;
    }

    moveTopRight(step) {
        let [x, y] = this.coordinatesToMove;

        x = x + step;
        y = y - step;

        this.coordinatesToMove = [x, y];

        this.element.style.transform = `translate(${x}px, ${y}px)`;
    }

    moveTopLeft(step) {
        let [x, y] = this.coordinatesToMove;

        x = x - step;
        y = y - step;

        this.coordinatesToMove = [x, y];

        this.element.style.transform = `translate(${x}px, ${y}px)`;
    }

    moveBottomLeft(step) {
        let [x, y] = this.coordinatesToMove;

        x = x - step;
        y = y + step;

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