import GridAppComponent from './GridAppComponent';
import { GridAppConnectorHTMLElement, GridAppComponentHTMLElement } from '../types';

export default abstract class GridAppConnector {
  private _label: string;
  private _element: GridAppConnectorHTMLElement;

  constructor(label: string) {
    this._label = label;

    this._element = document.createElement('div') as GridAppConnectorHTMLElement;
    this._element.gridConnector = this;

    this._element.classList.add(`app-component-connector`, this.class);
  }

  get element(): GridAppConnectorHTMLElement {
    return this._element;
  }

  get class(): string {
    return `app-component-connector-${this._label}`;
  }

  get component(): GridAppComponent {
    const gridComponentElement = this._element.closest('.app-component') as GridAppComponentHTMLElement | null;
    if (!gridComponentElement) {
      throw new Error('No grid component found for connector.');
    }

    return gridComponentElement.gridComponent;
  }

  abstract onConnectionStart(): void;

  abstract onConnectionEnd(): void;
}
