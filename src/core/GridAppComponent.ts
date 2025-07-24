import { GridAppComponentConfiguration, GridAppComponentHTMLElement, Position, RGBColor } from '../types';

export default abstract class GridAppComponent {
  private _type: string;
  private _element: GridAppComponentHTMLElement;

  constructor(config: GridAppComponentConfiguration) {
    this._type = config.type;

    this._element = document.createElement('div') as GridAppComponentHTMLElement;
    this._element.gridComponent = this;

    this._element.classList.add('app-component', this.class);
    this._element.dataset['type'] = 'component';
    this._element.dataset['componentType'] = this._type;
    this._element.style.setProperty('--x', '0');
    this._element.style.setProperty('--y', '0');

    this.setBackgroundColor(config.defaultBackgroundColor);
    this.setTextColor(config.defaultTextColor);
  }

  get type(): string {
    return this._type;
  }

  get class(): string {
    return `app-component-${this._type}`;
  }

  get element(): HTMLDivElement {
    return this._element;
  }

  getBackgroundColor(): RGBColor {
    const bgColor = this._element.style.getPropertyValue('--app-component-bg-color');
    return bgColor ? (bgColor.split(',').map(Number) as RGBColor) : [0, 0, 0];
  }
  setBackgroundColor(color: RGBColor): void {
    this._element.style.setProperty('--app-component-bg-color', color.join(', '));
  }

  getTextColor(): RGBColor {
    const textColor = this._element.style.getPropertyValue('--app-component-text-color');
    return textColor ? (textColor.split(',').map(Number) as RGBColor) : [0, 0, 0];
  }
  setTextColor(color: RGBColor): void {
    this._element.style.setProperty('--app-component-text-color', color.join(', '));
  }

  getPosition(): Position {
    return {
      x: Number(this._element.style.getPropertyValue('--x')),
      y: Number(this._element.style.getPropertyValue('--y')),
    };
  }
  setPosition(position: Position): void {
    this._element.style.setProperty('--x', position.x.toString());
    this._element.style.setProperty('--y', position.y.toString());
  }

  move(move: Position): void {
    const position = this.getPosition();

    this.setPosition({
      x: position.x - move.x,
      y: position.y - move.y,
    });
  }
}
