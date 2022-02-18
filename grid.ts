type GridMap = Map<string, string | null>;
type Coordinate = [string, number];

abstract class Grid {
  protected map: GridMap;
  protected type: "user" | "computer";
  grid: HTMLElement;
  squares: HTMLElement[] = [];

  constructor(type: "user" | "computer") {
    this.type = type;
    this.map = new Map();
    for (let i = 0; i < gridChars.length; i++) {
      for (let j = 1; j <= 10; j++) {
        const key = JSON.stringify([gridChars[i], j]);
        this.map.set(key, null);
      }
    }
    this.grid = document.createElement("div");
    this.grid.classList.add(
      "battleship-grid",
      this.type === "user" ? "grid-user" : "grid-computer"
    );
  }
  protected makeKey(tuple: Coordinate) {
    return JSON.stringify(tuple);
  }

  get(tuple: Coordinate) {
    const key = this.makeKey(tuple);
    return this.map.get(key);
  }

  set(tuple: Coordinate, value: string) {
    const key = this.makeKey(tuple);
    return this.map.set(key, value);
  }

  has(tuple: Coordinate) {
    const key = this.makeKey(tuple);
    return !!this.map.get(key);
  }

  createBoard() {
    for (const [key] of this.map) {
      const [char, index] = JSON.parse(key);
      const square = document.createElement("div");
      square.setAttribute("id", `${this.type}-${char}-${index}`);
      this.grid.appendChild(square);
      this.squares.push(square);
    }
    const container = document.getElementById("container");
    container?.appendChild(this.grid);
  }
}

class UserGrid extends Grid {
  constructor() {
    super("user");
  }
}

class ComputerGrid extends Grid {
  constructor() {
    super("computer");
  }

  private calculateOffset<T>(ship: Ship, array: T[], element: T) {
    let offset = 0;
    const index = array.indexOf(element);
    if (index + ship.length > array.length) {
      offset = index + ship.length - array.length;
    }
    return offset;
  }

  private makeRandomPosition(ship: Ship) {
    const shipSquares: Coordinate[] = [];
    let randomCoordiante = getRandomKey(this.map);
    const tuple: Coordinate = JSON.parse(randomCoordiante);
    const charPostion = gridChars.indexOf(tuple[0]);
    const directions: Direction[] = ["horizontal", "vertical"];
    ship.direction = randomElementFromArray(directions);

    if (ship.direction === "horizontal") {
      const horizontalOffset = this.calculateOffset(
        ship,
        gridNumbers,
        tuple[1]
      );
      for (let i = 0; i < ship.length; i++) {
        const number = gridNumbers[tuple[1] - 1 + i - horizontalOffset];
        shipSquares.push([tuple[0], number]);
      }
    } else {
      const verticalOffset = this.calculateOffset(ship, gridChars, tuple[0]);
      for (let i = 0; i < ship.length; i++) {
        const char = gridChars[charPostion + i - verticalOffset];
        shipSquares.push([char, tuple[1]]);
      }
    }

    return shipSquares;
  }

  getMap() {
    console.log(this.map);
  }

  private drawShip(positions: Coordinate[], type: ShipType) {
    positions.forEach((pos) => {
      const square = document.getElementById(`computer-${pos[0]}-${pos[1]}`);
      square?.classList.add(type);
    });
  }

  private isTaken(shipSquares: Coordinate[]) {
    return shipSquares.some((square) => this.get(square));
  }

  generateShipPlacement(ship: Ship) {
    let shipSquares = this.makeRandomPosition(ship);
    let isTaken = this.isTaken(shipSquares);

    while (isTaken) {
      shipSquares = this.makeRandomPosition(ship);
      isTaken = this.isTaken(shipSquares);
    }

    shipSquares.forEach((square) => this.set(square, ship.type));

    this.drawShip(shipSquares, ship.type);
  }
}
