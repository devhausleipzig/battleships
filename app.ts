document.addEventListener("DOMContentLoaded", () => {
  const userGrid = new UserGrid();
  const computerGrid = new ComputerGrid();
  userGrid.createBoard();
  computerGrid.createBoard();

  const destroyer = new Ship("destroyer");
  computerGrid.generateShipPlacement(destroyer);

  const cruiser = new Ship("cruiser");
  computerGrid.generateShipPlacement(cruiser);

  const submarine = new Ship("submarine");
  computerGrid.generateShipPlacement(submarine);

  const battleship = new Ship("battleship");
  computerGrid.generateShipPlacement(battleship);

  const carrier = new Ship("carrier");
  computerGrid.generateShipPlacement(carrier);
});
