import GridAppComponent from './core/GridAppComponent';
import {
  GridAppComponentData,
  GridAppComponentHTMLElement,
  GridAppConfiguration,
  GridAppConnectionHTMLElement,
  Position,
} from './types';
import GridAppGrid from './GridAppGrid';
import GridAppLineConnection from './connections/GridAppLineConnection';
import GridAppBlockComponent from './components/GridAppBlockComponent';

export default class GridApp {
  private _element: HTMLDivElement;
  private _config: GridAppConfiguration;

  private _grid: GridAppGrid;
  private _components: GridAppComponentData[];
  private _appPanelElement: HTMLDivElement;

  private _mouseDown: boolean;
  private _lastMousePosition: Position;
  private _movingElement: GridAppComponentHTMLElement | GridAppConnectionHTMLElement | null;

  constructor(
    appContainerElement: HTMLDivElement,
    config: GridAppConfiguration,
    customComponents: GridAppComponentData[] = [],
  ) {
    this._element = appContainerElement;
    this._config = config;

    this._element.classList.add('app-container');

    const appRect = this._element.getBoundingClientRect();
    const initialOffset = {
      x: appRect.width / 2,
      y: appRect.height / 2,
    };

    this._grid = new GridAppGrid(config.grid, initialOffset);
    this._element.append(this._grid.element);

    this._components = [{ type: 'block', component: GridAppBlockComponent }, ...customComponents];

    this._appPanelElement = document.createElement('div');
    this._appPanelElement.classList.add('app-panel', 'open');

    this._element.append(this._appPanelElement);

    this._appPanelElement.style.setProperty('--app-panel-bg-color', config.panel.backgroundColor.join(', '));

    this._mouseDown = false;
    this._lastMousePosition = { x: 0, y: 0 };
    this._movingElement = null;

    this._registerEventListeners();
  }

  get element(): HTMLDivElement {
    return this._element;
  }

  get gridElement(): HTMLDivElement {
    return this._grid.element;
  }

  get config(): GridAppConfiguration {
    return this._config;
  }

  get components(): GridAppComponentData[] {
    return this._components;
  }

  getOffset(): Position {
    return {
      x: Number(this._grid.element.style.getPropertyValue('--app-offset-x')),
      y: Number(this._grid.element.style.getPropertyValue('--app-offset-y')),
    };
  }

  updateOffset(move: Position): void {
    const currentOffset: Position = this.getOffset();

    this._grid.element.style.setProperty('--app-offset-x', (currentOffset.x - move.x).toString());
    this._grid.element.style.setProperty('--app-offset-y', (currentOffset.y - move.y).toString());
  }

  getZoom(): number {
    return Number(this._grid.element.style.getPropertyValue('--app-zoom'));
  }

  updateZoom(zoom: number): void {
    const currentZoom = this.getZoom();
    const newZoom = Math.min(this._config.grid.zoom.max, Math.max(this._config.grid.zoom.min, currentZoom + zoom));

    this._grid.element.style.setProperty('--app-zoom', newZoom.toString());
  }

  append(...components: GridAppComponent[]): void {
    for (const component of components) {
      console.log(component.element);
      this._grid.element.append(component.element);
    }
  }

  private _registerEventListeners(): void {
    window.addEventListener('pointerdown', (e: MouseEvent): void => {
      const target = e.target as HTMLElement;
      if (!target.closest('.app-grid')) {
        return;
      }

      e.preventDefault();

      this._mouseDown = true;
      this._lastMousePosition = {
        x: e.clientX,
        y: e.clientY,
      };

      const componentconnectionElement = target.closest('.app-component-connector') as HTMLDivElement | null;
      if (componentconnectionElement) {
        const zoom = this.getZoom();
        const offset = this.getOffset();

        const connection = new GridAppLineConnection();
        connection.setStartPosition(componentconnectionElement, {
          x: (e.clientX - this._grid.initialOffset.x) / zoom + this._grid.initialOffset.x - offset.x,
          y: (e.clientY - this._grid.initialOffset.y) / zoom + this._grid.initialOffset.y - offset.y,
        });

        this._grid.element.append(connection.element);

        this._movingElement = connection.element;
        this._movingElement.classList.add('moving');

        return;
      }

      const componentElement = target.closest('.app-component') as GridAppComponentHTMLElement | null;
      if (componentElement) {
        componentElement.parentElement?.append(componentElement);

        this._movingElement = componentElement;
        this._movingElement.classList.add('moving');

        return;
      }
    });

    window.addEventListener('pointermove', (e: MouseEvent): void => {
      e.preventDefault();
      if (!this._mouseDown) return;

      const zoom = this.getZoom();
      const offset = this.getOffset();

      if (this._movingElement) {
        switch (this._movingElement.dataset['type']) {
          case 'component': {
            const element = this._movingElement as GridAppComponentHTMLElement;

            element.gridComponent.move({
              x: (this._lastMousePosition.x - e.clientX) / zoom,
              y: (this._lastMousePosition.y - e.clientY) / zoom,
            });

            break;
          }
          case 'connection': {
            const element = this._movingElement as GridAppConnectionHTMLElement;

            element.gridConnection.setEndPosition({
              x: (e.clientX - this._grid.initialOffset.x) / zoom + this._grid.initialOffset.x - offset.x,
              y: (e.clientY - this._grid.initialOffset.y) / zoom + this._grid.initialOffset.y - offset.y,
            });

            break;
          }
        }
      } else {
        this.updateOffset({
          x: (this._lastMousePosition.x - e.clientX) / zoom,
          y: (this._lastMousePosition.y - e.clientY) / zoom,
        });
      }

      this._lastMousePosition = {
        x: e.clientX,
        y: e.clientY,
      };
    });

    window.addEventListener('pointerup', (e: MouseEvent): void => {
      e.preventDefault();
      if (!this._mouseDown) return;

      const target = e.target as HTMLDivElement;

      if (this._movingElement) {
        const zoom = this.getZoom();
        const offset = this.getOffset();

        switch (this._movingElement.dataset['type']) {
          case 'connection': {
            const element = this._movingElement as GridAppConnectionHTMLElement;

            const pointedElement = target.closest('.app-component-connector') as HTMLDivElement | null;

            if (pointedElement) {
              element.gridConnection.setEndPosition(
                {
                  x: (e.clientX - this._grid.initialOffset.x) / zoom + this._grid.initialOffset.x - offset.x,
                  y: (e.clientY - this._grid.initialOffset.y) / zoom + this._grid.initialOffset.y - offset.y,
                },
                pointedElement,
              );
            } else {
              element.parentElement?.removeChild(element);
            }

            break;
          }
        }

        this._movingElement.classList.remove('moving');
      }

      this._movingElement = null;
      this._mouseDown = false;
    });

    window.addEventListener(
      'wheel',
      (e: WheelEvent): void => {
        const target = e.target as HTMLElement;
        if (!target.closest('.app-grid')) {
          return;
        }

        e.preventDefault();

        this.updateZoom(e.deltaY < 0 ? this._config.grid.zoom.step : -this._config.grid.zoom.step);
      },
      { passive: false },
    );
  }
}
