import { GridAppGridConfiguration, Position } from './types';

export default class GridAppGrid {
  private _config: GridAppGridConfiguration;
  private _initialOffset: Position;

  private _element: HTMLDivElement;

  constructor(config: GridAppGridConfiguration, initialOffset: Position) {
    this._config = config;
    this._initialOffset = initialOffset;

    this._element = document.createElement('div');
    this._element.classList.add('app-grid');

    this._element.style.setProperty('--app-bg-grid-size', config.size.toString());
    this._element.style.setProperty('--app-offset-x', this._initialOffset.x.toString());
    this._element.style.setProperty('--app-offset-y', this._initialOffset.y.toString());
    this._element.style.setProperty('--app-zoom', config.zoom.default.toString());
  }

  get element(): HTMLDivElement {
    return this._element;
  }

  get initialOffset(): Position {
    return this._initialOffset;
  }

  get config(): GridAppGridConfiguration {
    return this._config;
  }
}
