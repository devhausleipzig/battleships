type ShipType =
  | "destroyer"
  | "submarine"
  | "cruiser"
  | "battleship"
  | "carrier";

type Direction = "vertical" | "horizontal";

class Ship {
  type: ShipType;
  length: number;
  direction: "horizontal" | "vertical" = "horizontal";

  constructor(type: ShipType) {
    this.type = type;
    switch (this.type) {
      case "destroyer":
        this.length = 2;
        break;
      case "cruiser":
      case "submarine":
        this.length = 3;
        break;
      case "battleship":
        this.length = 4;
        break;
      case "carrier":
        this.length = 5;
        break;
    }
  }
}
