import { GridAppComponentConfiguration, GridAppComponentHTMLElement, Position } from './types';

export default class GridAppComponent {
  private _element: GridAppComponentHTMLElement;

  constructor(config: GridAppComponentConfiguration, position: Position) {
    this._element = document.createElement('div') as GridAppComponentHTMLElement;
    this._element.gridComponent = this;

    this._element.classList.add('app-component');
    this._element.dataset['type'] = 'component';
    this._element.style.setProperty('--x', position.x.toString());
    this._element.style.setProperty('--y', position.y.toString());
    this._element.style.setProperty('--app-component-bg-color', config.backgroundColor.join(', '));
    this._element.style.setProperty('--app-component-text-color', config.textColor.join(', '));

    const componentHeadElement = document.createElement('div');
    componentHeadElement.classList.add('app-component-head');
    componentHeadElement.innerText = 'Title';
    this._element.append(componentHeadElement);

    const componentBodyElement = document.createElement('div');
    componentBodyElement.classList.add('app-component-body');
    componentBodyElement.innerText = 'ASD';
    this._element.append(componentBodyElement);

    const componentLeftConnectorElement = document.createElement('div');
    componentLeftConnectorElement.classList.add('app-component-connector', 'app-component-left-connector');
    this._element.append(componentLeftConnectorElement);

    const componentRightConnectorElement = document.createElement('div');
    componentRightConnectorElement.classList.add('app-component-connector', 'app-component-right-connector');
    this._element.append(componentRightConnectorElement);
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
