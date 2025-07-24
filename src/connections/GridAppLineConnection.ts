import GridAppConnection from '../core/GridAppConnection';
import { Position } from '../types';

export default class GridAppLineConnection extends GridAppConnection {
  constructor() {
    super();
  }

  setStartPosition(element: HTMLDivElement, position: Position): void {
    this.setStartElement(element);

    this.element.style.setProperty('--x1', position.x.toString());
    this.element.style.setProperty('--y1', position.y.toString());
    this.element.style.setProperty('--deg', '0');
  }

  setEndPosition(position: Position, element?: HTMLDivElement): void {
    this.element.style.setProperty('--x2', position.x.toString());
    this.element.style.setProperty('--y2', position.y.toString());

    const startPosition = this.startPosition;

    const deg = this.calcRotateDeg(startPosition, position);
    const distance = this.calcDistance(startPosition, position);

    this.element.style.setProperty('--deg', deg.toString());
    this.element.style.setProperty('--dist', distance.toString());

    if (element) {
      this.setEndElement(element);
    }
  }

  calcRotateDeg(pos1: Position, pos2: Position): number {
    const x = pos2.x - pos1.x;
    const y = pos2.y - pos1.y;

    const angle = Math.atan2(x, y);

    const deg = -angle * (180 / Math.PI);

    return deg;
  }

  calcDistance(pos1: Position, pos2: Position): number {
    const x = (pos2.x - pos1.x) ** 2;
    const y = (pos2.y - pos1.y) ** 2;

    return Math.sqrt(x + y);
  }
}
