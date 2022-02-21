document.addEventListener("DOMContentLoaded", () => {
  const rotateButton = document.getElementById("rotate") as Element;
  const startButton = document.getElementById("start") as Element;
  const info = document.getElementById("info") as Element;

  const playerGrid = new PlayerGrid();
  const computerGrid = new ComputerGrid();
  playerGrid.createBoard();
  computerGrid.createBoard();

  const computerShips: Ship[] = computerGrid.ships;
  computerShips.forEach((ship) => computerGrid.generateShipPlacement(ship));

  const playerShips: PlayerShip[] = playerGrid.shipsToBePlaced;

  rotateButton.addEventListener("click", () =>
    playerShips.forEach((ship) => ship.rotateShip())
  );

  playerGrid.addListeners();

  function fire(square: HTMLElement) {
    if (!playerGrid.ships.length || !computerGrid.ships.length) {
      return;
    }
    computerGrid.takeShot(square);

    if (playerGrid.ships.length && computerGrid.ships.length) {
      const firedSquare = playerGrid.randomHit();
      setTimeout(() => playerGrid.takeShot(firedSquare), 1000);
    }
  }

  startButton.addEventListener("click", () => {
    if (playerGrid.shipsToBePlaced.length > 0) {
      info.innerHTML = "Please place all of your ships";
      return;
    }

    info.innerHTML = "Game started";

    computerGrid.squares.forEach((square) => {
      square.addEventListener("click", () => fire(square));
    });
  });
});
