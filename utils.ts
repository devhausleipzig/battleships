function randomElementFromArray<T>(array: T[]): T {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function getRandomKey(grid: GridState) {
  const keys = Object.keys(grid);
  return randomElementFromArray(keys);
}

function getElementFromEvent(e: Event): Element {
  return e.target as Element;
}

const gridChars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
const gridNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const shipNames: ShipType[] = [
  "destroyer",
  "submarine",
  "cruiser",
  "battleship",
  "carrier",
];
