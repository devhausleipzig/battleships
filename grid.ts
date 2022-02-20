type GridMap = Map<string, string | null>;
type Coordinate = [string, number];

abstract class Grid {
  protected map: GridMap;
  protected type: "player" | "computer";
  element: HTMLElement;
  squares: HTMLElement[] = [];

  constructor(type: "player" | "computer") {
    this.type = type;
    this.map = new Map();
    for (let i = 0; i < gridChars.length; i++) {
      for (let j = 1; j <= 10; j++) {
        const key = JSON.stringify([gridChars[i], j]);
        this.map.set(key, null);
      }
    }
    this.element = document.createElement("div");
    this.element.classList.add(
      "battleship-grid",
      this.type === "player" ? "grid-player" : "grid-computer"
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
      this.element.appendChild(square);
      this.squares.push(square);
    }
    const container = document.getElementById("container");
    container?.appendChild(this.element);
  }

  getMap() {
    console.log(this.map);
  }

  protected calculateOffset<T>(ship: Ship, array: T[], element: T) {
    let offset = 0;
    const index = array.indexOf(element);
    if (index + ship.length > array.length) {
      offset = index + ship.length - array.length;
    }
    return offset;
  }

  protected isTaken(shipSquares: Coordinate[]) {
    return shipSquares.some((square) => this.get(square));
  }

  protected drawShip(positions: Coordinate[], shipType: ShipType) {
    positions.forEach((pos) => {
      const square = document.getElementById(
        `${this.type}-${pos[0]}-${pos[1]}`
      );
      square?.classList.add("taken", shipType);
    });
  }
}

class PlayerGrid extends Grid {
  ships: PlayerShip[] = [];
  constructor() {
    super("player");
    shipNames.forEach((shipName) => this.ships.push(new PlayerShip(shipName)));
  }

  placeShip(ship: Ship, shipPart: number, position: Coordinate) {
    const shipSquares: Coordinate[] = [];
    const charPostion = gridChars.indexOf(position[0]);

    if (ship.direction === "horizontal") {
      for (let i = 0; i < ship.length; i++) {
        const number = position[1] + i - shipPart;
        console.log(number);
        if (number > 10 || number <= 0) {
          return;
        }
        shipSquares.push([position[0], number]);
      }
    } else {
      for (let i = 0; i < ship.length; i++) {
        const char = gridChars[charPostion + i - shipPart];
        if (!char) {
          return;
        }
        shipSquares.push([char, position[1]]);
      }
    }

    const isTaken = this.isTaken(shipSquares);

    if (!isTaken) {
      shipSquares.forEach((square) => this.set(square, ship.type));
      this.drawShip(shipSquares, ship.type);
      document.querySelector(`.${ship.type}-container`)?.remove();
      this.ships = this.ships.filter((s) => s !== ship);
    }
  }

  randomHit(): Element {
    let sqaureValue: string | null | undefined;
    let randomKey = getRandomKey(this.map);
    let coordinate: Coordinate = JSON.parse(randomKey);
    sqaureValue = this.get(coordinate);
    while (sqaureValue === "hit" || sqaureValue === "miss") {
      console.log(sqaureValue);
      randomKey = getRandomKey(this.map);
      coordinate = JSON.parse(randomKey);
      sqaureValue = this.get(coordinate);
      console.log(sqaureValue);
    }
    return document.getElementById(
      `player-${coordinate[0]}-${coordinate[1]}`
    ) as Element;
  }
}

class ComputerGrid extends Grid {
  ships: Ship[] = [];
  constructor() {
    super("computer");
    shipNames.forEach((shipName) => this.ships.push(new Ship(shipName)));
  }

  private makeRandomPosition(ship: Ship): Coordinate[] {
    const shipSquares: Coordinate[] = [];
    let randomKey = getRandomKey(this.map);
    const coordinate: Coordinate = JSON.parse(randomKey);
    const charPostion = gridChars.indexOf(coordinate[0]);
    const directions: Direction[] = ["horizontal", "vertical"];
    ship.direction = randomElementFromArray(directions);

    if (ship.direction === "horizontal") {
      const horizontalOffset = this.calculateOffset(
        ship,
        gridNumbers,
        coordinate[1]
      );
      for (let i = 0; i < ship.length; i++) {
        const number = coordinate[1] + i - horizontalOffset;
        shipSquares.push([coordinate[0], number]);
      }
    } else {
      const verticalOffset = this.calculateOffset(
        ship,
        gridChars,
        coordinate[0]
      );
      for (let i = 0; i < ship.length; i++) {
        const char = gridChars[charPostion + i - verticalOffset];
        shipSquares.push([char, coordinate[1]]);
      }
    }

    return shipSquares;
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
