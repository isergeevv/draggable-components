import { GridAppGroupConfiguration, GridAppGroupHTMLElement, Position } from './types';

export default class GridAppGroup {
  private _element: GridAppGroupHTMLElement;

  constructor(config: GridAppGroupConfiguration, position: Position) {
    this._element = document.createElement('div') as GridAppGroupHTMLElement;
    this._element.gridGroup = this;

    this._element.classList.add('app-group');
    this._element.dataset['type'] = 'group';
    this._element.style.setProperty('--x', position.x.toString());
    this._element.style.setProperty('--y', position.y.toString());
    this.element.style.setProperty('--app-group-bg-color', config.backgroundColor.join(', '));
  }

  get element(): HTMLDivElement {
    return this._element;
  }

  get headElement(): HTMLDivElement {
    return this._element.querySelector('.app-component-head') as HTMLDivElement;
  }

  get bodyElement(): HTMLDivElement {
    return this._element.querySelector('.app-component-body') as HTMLDivElement;
  }

  getPosition(): Position {
    return {
      x: Number(this._element.style.getPropertyValue('--x')),
      y: Number(this._element.style.getPropertyValue('--y')),
    };
  }

  setTitle(value: string): void {
    this.headElement.innerText = value;
  }

  move(move: Position): void {
    const position = this.getPosition();

    this._element.style.setProperty('--x', (position.x - move.x).toString());
    this._element.style.setProperty('--y', (position.y - move.y).toString());
  }
}
