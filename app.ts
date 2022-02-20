document.addEventListener("DOMContentLoaded", () => {
  const rotateButton = document.getElementById("rotate") as Element;
  const startButton = document.getElementById("start") as Element;
  const info = document.getElementById("info") as Element;
  const turn = document.getElementById("turn") as Element;

  const playerGrid = new PlayerGrid();
  const computerGrid = new ComputerGrid();
  playerGrid.createBoard();
  computerGrid.createBoard();

  const computerShips: Ship[] = computerGrid.ships;
  computerShips.forEach((ship) => computerGrid.generateShipPlacement(ship));

  const playerShips: PlayerShip[] = playerGrid.ships;

  rotateButton.addEventListener("click", () =>
    playerShips.forEach((ship) => ship.rotateShip())
  );

  let selectedShip: PlayerShip;
  let selectedShipPart: number;

  playerShips.forEach((ship) => {
    ship.element.addEventListener("mousedown", selectShipPart);
    ship.element.addEventListener("dragstart", () => selectShip(ship));
  });

  const playerSquares = playerGrid.element.children;

  Array.from(playerSquares).forEach((square) => {
    square.addEventListener("dragstart", doNothing);
    square.addEventListener("dragover", doNothing);
    square.addEventListener("dragenter", doNothing);
    square.addEventListener("dragleave", doNothing);
    square.addEventListener("drop", placeShip);
    square.addEventListener("dragend", doNothing);
  });

  function selectShipPart(e: Event) {
    const target = getElementFromEvent(e);
    selectedShipPart = parseInt(target.id.substring(target.id.length - 1));
  }

  function selectShip(ship: PlayerShip) {
    selectedShip = ship;
  }

  function doNothing(e: Event) {
    e.preventDefault();
  }

  function placeShip(e: Event) {
    const target = getElementFromEvent(e);
    const positionTuple = target.id.split("-").slice(1);
    const position: Coordinate = [positionTuple[0], parseInt(positionTuple[1])];
    playerGrid.placeShip(selectedShip, selectedShipPart, position);
  }

  function playGame(currentPlayer: "player" | "computer" = "player") {
    turn.innerHTML = `${
      currentPlayer === "computer" ? "Computers" : "Players"
    } turn`;
    if (currentPlayer === "player") {
      computerGrid.squares.forEach((square) => {
        square.addEventListener("click", () =>
          revealSquare(square, currentPlayer)
        );
      });
    } else {
      const firedSquare = playerGrid.randomHit();
      revealSquare(firedSquare, "computer");
    }
  }

  startButton.addEventListener("click", () => playGame());

  function revealSquare(square: Element, currentPlayer: "player" | "computer") {
    let grid = currentPlayer === "player" ? computerGrid : playerGrid;
    const [_, char, number] = square.id.split("-");
    const position: Coordinate = [char, parseInt(number)];
    const squareValue = grid.get(position);
    if (shipNames.includes(squareValue as ShipType)) {
      console.log("hit", squareValue);
      const hitShip = grid.ships.find((ship) => ship.type === squareValue);
      hitShip?.hit();
      square.classList.add("boom");
      grid.set(position, "hit");
      if (hitShip?.sunken()) {
        info.innerHTML = `${hitShip.type.toUpperCase()} sunken`;
      }
    } else if (!squareValue) {
      console.log("miss");
      square.classList.add("miss");
      grid.set(position, "miss");
    }

    playGame(currentPlayer === "computer" ? "player" : "computer");
  }
});
