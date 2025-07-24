import { GridAppConnectionHTMLElement, Position } from '../types';

export default abstract class GridAppConnection {
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

  setStartElement(element: HTMLDivElement) {
    this._startElement = element;
  }

  setEndElement(element: HTMLDivElement) {
    this._endElement = element;
  }

  abstract setStartPosition(element: HTMLDivElement, position: Position): void;

  abstract setEndPosition(position: Position, element?: HTMLDivElement): void;
}
