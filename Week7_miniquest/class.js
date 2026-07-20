class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }

  perimeter() {
    return 2 * (this.width + this.height);
  }
}

const rectangle = new Rectangle(10, 5);
console.log(rectangle.area());
console.log(rectangle.perimeter());

class Square extends Rectangle {
  constructor(width, height) {
    super(width, height);
  }

  isSquare() {
    return this.width === this.height;
  }
}

const square = new Square(5, 5);
console.log(square.area());
console.log(square.perimeter());
console.log(square.isSquare());

const notSquare = new Square(5, 3);
console.log(notSquare.isSquare());
