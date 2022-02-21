type PossibleValue = "" | ShipType | "hit" | "miss";
type Key = `${string}-${number}`;
type GridState = Record<Key, PossibleValue>;
type Coordinate = [string, number];

abstract class Grid {
  protected state: GridState;
  protected type: "player" | "computer";
  ships: Ship[] = [];
  element: HTMLElement;
  squares: HTMLElement[] = [];

  constructor(type: "player" | "computer") {
    this.type = type;
    this.state = {};
    for (let i = 0; i < gridChars.length; i++) {
      for (let j = 1; j <= 10; j++) {
        const key = this.makeKey([gridChars[i], j]);
        this.state[key] = "";
      }
    }
    this.element = document.createElement("div");
    this.element.classList.add(
      "battleship-grid",
      this.type === "player" ? "grid-player" : "grid-computer"
    );
  }

  protected makeKey(tuple: Coordinate): Key {
    const [char, number] = tuple;
    return `${char}-${number}`;
  }

  protected makeCoordinate(key: string): Coordinate {
    const [char, number] = key.split("-");
    return [char, parseInt(number)];
  }

  get(tuple: Coordinate): PossibleValue {
    const key = this.makeKey(tuple);
    return this.state[key];
  }

  set(tuple: Coordinate, value: PossibleValue): void {
    const key = this.makeKey(tuple);
    this.state[key] = value;
  }

  has(tuple: Coordinate): boolean {
    const key = this.makeKey(tuple);
    return !!this.state[key];
  }

  createBoard(): void {
    for (const key in this.state) {
      const square = document.createElement("div");
      square.setAttribute("id", `${this.type}-${key}`);
      this.element.appendChild(square);
      this.squares.push(square);
    }
    const container = document.getElementById("container");
    container?.appendChild(this.element);
  }

  getMap(): void {
    console.log(this.state);
  }

  removeShip(ship: Ship) {
    this.ships = this.ships.filter((s) => s !== ship);
  }

  protected calculateOffset<T>(ship: Ship, array: T[], element: T) {
    let offset = 0;
    const index = array.indexOf(element);
    if (index + ship.length > array.length) {
      offset = index + ship.length - array.length;
    }
    return offset;
  }

  protected isTaken(shipSquares: Coordinate[]): boolean {
    return shipSquares.some((square) => this.get(square));
  }

  protected drawShip(positions: Coordinate[], shipType: ShipType): void {
    positions.forEach((pos) => {
      const square = document.getElementById(
        `${this.type}-${pos[0]}-${pos[1]}`
      );
      square?.classList.add("taken", shipType);
    });
  }

  takeShot(square: Element) {
    const info = document.getElementById("info") as Element;
    const currentPlayer = this.type === "computer" ? "You" : "CPU";
    const [_, char, number] = square.id.split("-");
    const position: Coordinate = [char, parseInt(number)];
    const squareValue = this.get(position);

    if (shipNames.includes(squareValue as ShipType)) {
      const hitShip = this.ships.find(
        (ship) => ship.type === squareValue
      ) as Ship;
      hitShip.hit();
      square.classList.add("boom");
      this.set(position, "hit");
      info.innerHTML = `${currentPlayer} hit`;
      if (hitShip.sunken()) {
        info.innerHTML = `${
          this.type === "computer" ? "CPU" : "Your"
        } ${hitShip.type.toUpperCase()} sunken`;
        this.removeShip(hitShip);
        if (!this.ships.length) {
          info.innerHTML = "Game Over";
          return;
        }
      }
    } else if (!squareValue) {
      square.classList.add("miss");
      this.set(position, "miss");
      info.innerHTML = `${currentPlayer} missed`;
    }
  }
}

class PlayerGrid extends Grid {
  shipsToBePlaced: PlayerShip[] = [];
  ships: PlayerShip[] = [];
  selectedShip: PlayerShip | null = null;
  selectedShipPart: number = 0;

  constructor() {
    super("player");

    shipNames.forEach((shipName) =>
      this.shipsToBePlaced.push(new PlayerShip(shipName))
    );
  }

  addListeners() {
    this.shipsToBePlaced.forEach((ship) => {
      ship.element.addEventListener("mousedown", (e) => {
        const target = getElementFromEvent(e);
        this.selectedShipPart = parseInt(
          target.id.substring(target.id.length - 1)
        );
      });
      ship.element.addEventListener(
        "dragstart",
        () => (this.selectedShip = ship)
      );
    });

    this.squares.forEach((square) => {
      square.addEventListener("dragstart", (e) => e.preventDefault());
      square.addEventListener("dragover", (e) => e.preventDefault());
      square.addEventListener("dragenter", (e) => e.preventDefault());
      square.addEventListener("dragleave", (e) => e.preventDefault());
      square.addEventListener("drop", (e) => {
        const target = getElementFromEvent(e);
        const positionTuple = target.id.split("-").slice(1);
        const position: Coordinate = [
          positionTuple[0],
          parseInt(positionTuple[1]),
        ];
        if (this.selectedShip)
          this.placeShip(this.selectedShip, this.selectedShipPart, position);
      });
      square.addEventListener("dragend", (e) => e.preventDefault());
    });
  }

  placeShip(ship: PlayerShip, shipPart: number, position: Coordinate): void {
    const shipSquares: Coordinate[] = [];
    const charPostion = gridChars.indexOf(position[0]);

    if (ship.direction === "horizontal") {
      for (let i = 0; i < ship.length; i++) {
        const number = position[1] + i - shipPart;
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
      this.shipsToBePlaced = this.shipsToBePlaced.filter((s) => s !== ship);
      this.ships.push(ship);
    }
  }

  randomHit(): Element {
    let sqaureValue: PossibleValue;
    let randomKey = getRandomKey(this.state);
    let coordinate: Coordinate = this.makeCoordinate(randomKey);
    sqaureValue = this.get(coordinate);
    while (sqaureValue === "hit" || sqaureValue === "miss") {
      randomKey = getRandomKey(this.state);
      coordinate = this.makeCoordinate(randomKey);
      sqaureValue = this.get(coordinate);
    }
    return document.getElementById(
      `player-${coordinate[0]}-${coordinate[1]}`
    ) as Element;
  }
}

class ComputerGrid extends Grid {
  constructor() {
    super("computer");

    shipNames.forEach((shipName) => this.ships.push(new Ship(shipName)));
  }

  private makeRandomPosition(ship: Ship): Coordinate[] {
    const shipSquares: Coordinate[] = [];
    let randomKey = getRandomKey(this.state);
    const coordinate: Coordinate = this.makeCoordinate(randomKey);
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

  generateShipPlacement(ship: Ship): void {
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
