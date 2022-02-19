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

  let selectedShipName;
  let selectedShipPart: number;
  let selectedShip: PlayerShip;

  playerShips.forEach((ship) => {
    ship.element.addEventListener("mousedown", selectShipPart);
    ship.element.addEventListener("dragstart", () => dragShip(ship));
  });

  const playerSquares = playerGrid.element.children;

  Array.from(playerSquares).forEach((square) => {
    square.addEventListener("dragstart", dragStart);
    square.addEventListener("dragover", doNothing);
    square.addEventListener("dragenter", doNothing);
    square.addEventListener("dragleave", doNothing);
    square.addEventListener("drop", dragDrop);
    square.addEventListener("dragend", dragEnd);
  });

  function selectShipPart(e: Event) {
    const target = e.target as Element;
    selectedShipPart = parseInt(target.id.split("-")[1]);
  }

  function dragShip(ship: PlayerShip) {
    selectedShip = ship;
  }

  function dragStart(e: Event) {
    const target = e.target as Element;
    selectedShipName = target.classList[1].split("-")[0];
    console.log(selectedShipName);
  }

  function doNothing(e: Event) {
    e.preventDefault();
  }

  function dragDrop(e: Event) {
    const target = e.target as Element;
    const id = target.id;
    const positionTuple = id.split("-").slice(1);
    const position: Coordinate = [positionTuple[0], parseInt(positionTuple[1])];
    console.log(position);
    playerGrid.placeShip(selectedShip, selectedShipPart, position);
  }
  function dragEnd(e: Event) {
    console.log(e.target);
  }
});
