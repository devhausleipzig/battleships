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

  const playerShips: PlayerShip[] = playerGrid.shipsToBePlaced;

  rotateButton.addEventListener("click", () =>
    playerShips.forEach((ship) => ship.rotateShip())
  );

  playerGrid.addListeners();

  function playTurn(currentPlayer: "player" | "computer" = "player") {
    if (playerGrid.shipsToBePlaced.length > 0) {
      info.innerHTML = "Please place all of your ships";
      return;
    }

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

  startButton.addEventListener("click", () => playTurn());

  function revealSquare(square: Element, currentPlayer: "player" | "computer") {
    let grid = currentPlayer === "player" ? computerGrid : playerGrid;
    const [_, char, number] = square.id.split("-");
    const position: Coordinate = [char, parseInt(number)];
    const squareValue = grid.get(position);

    if (shipNames.includes(squareValue as ShipType)) {
      const hitShip = grid.ships.find((ship) => ship.type === squareValue);
      hitShip?.hit();
      square.classList.add("boom");
      grid.set(position, "hit");
      if (hitShip?.sunken()) {
        info.innerHTML = `${
          currentPlayer === "player" ? "CPU" : "Your"
        } ${hitShip.type.toUpperCase()} sunken`;
        grid.removeShip(hitShip);
        if (!grid.ships.length) {
          info.innerHTML = "Game Over";
          return;
        }
      }
      playTurn(currentPlayer === "computer" ? "player" : "computer");
    } else if (!squareValue) {
      square.classList.add("miss");
      grid.set(position, "miss");
      playTurn(currentPlayer === "computer" ? "player" : "computer");
    }
  }
});
