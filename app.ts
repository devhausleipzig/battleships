document.addEventListener("DOMContentLoaded", () => {
  const rotateButton = document.getElementById("rotate") as Element;

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
});
