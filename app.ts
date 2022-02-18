document.addEventListener("DOMContentLoaded", () => {
  const userGrid = new UserGrid();
  const computerGrid = new ComputerGrid();
  userGrid.createBoard();
  computerGrid.createBoard();

  const ships = [
    new Ship("destroyer"),
    new Ship("cruiser"),
    new Ship("submarine"),
    new Ship("battleship"),
    new Ship("carrier"),
  ];

  ships.forEach((ship) => computerGrid.generateShipPlacement(ship));
});
