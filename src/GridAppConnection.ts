import { GridAppConnectionHTMLElement, Position } from './types';

export default class GridAppConnection {
  private _startElement: HTMLDivElement | null;
  private _endElement: HTMLDivElement | null;
  private _element: GridAppConnectionHTMLElement;

  constructor() {
    this._element = document.createElement('div') as GridAppConnectionHTMLElement;
    this._element.gridConnection = this;

    this._element.classList.add('app-connection');
    this._element.dataset['type'] = 'connection';
    this._element.style.setProperty('--x1', '0');
    this._element.style.setProperty('--y1', '0');
    this._element.style.setProperty('--x2', '0');
    this._element.style.setProperty('--y2', '0');

    this._startElement = null;
    this._endElement = null;
  }

  get element() {
    return this._element;
  }

  get startElement() {
    return this._startElement;
  }

  get endElement() {
    return this._endElement;
  }

  get startPosition() {
    return {
      x: Number(this._element.style.getPropertyValue('--x1')),
      y: Number(this._element.style.getPropertyValue('--y1')),
    };
  }

  get endPosition() {
    return {
      x: Number(this._element.style.getPropertyValue('--x2')),
      y: Number(this._element.style.getPropertyValue('--y2')),
    };
  }

  setStartPosition(element: HTMLDivElement, position: Position) {
    this._startElement = element;

    this._element.style.setProperty('--x1', position.x.toString());
    this._element.style.setProperty('--y1', position.y.toString());
    this._element.style.setProperty('--deg', '0');
  }

  setEndPosition(position: Position, element?: HTMLDivElement) {
    this._element.style.setProperty('--x2', position.x.toString());
    this._element.style.setProperty('--y2', position.y.toString());

    const startPosition = this.startPosition;

    const deg = this.calcRotateDeg(startPosition, position);
    const distance = this.calcDistance(startPosition, position);

    this._element.style.setProperty('--deg', deg.toString());
    this._element.style.setProperty('--dist', distance.toString());

    if (element) this._endElement = element;
  }

  calcRotateDeg(pos1: Position, pos2: Position) {
    const x = pos2.x - pos1.x;
    const y = pos2.y - pos1.y;

    const angle = Math.atan2(x, y);

    const deg = -angle * (180 / Math.PI);

    return deg;
  }

  calcDistance(pos1: Position, pos2: Position) {
    const x = (pos2.x - pos1.x) ** 2;
    const y = (pos2.y - pos1.y) ** 2;

    return Math.sqrt(x + y);
  }
}
