class GridAppConnection {
    constructor() {
        this._element = document.createElement('div');
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
    setStartPosition(element, position) {
        this._startElement = element;
        this._element.style.setProperty('--x1', position.x.toString());
        this._element.style.setProperty('--y1', position.y.toString());
        this._element.style.setProperty('--deg', '0');
    }
    setEndPosition(position, element) {
        this._element.style.setProperty('--x2', position.x.toString());
        this._element.style.setProperty('--y2', position.y.toString());
        const startPosition = this.startPosition;
        const deg = this.calcRotateDeg(startPosition, position);
        const distance = this.calcDistance(startPosition, position);
        this._element.style.setProperty('--deg', deg.toString());
        this._element.style.setProperty('--dist', distance.toString());
        if (element)
            this._endElement = element;
    }
    calcRotateDeg(pos1, pos2) {
        const x = pos2.x - pos1.x;
        const y = pos2.y - pos1.y;
        const angle = Math.atan2(x, y);
        const deg = -angle * (180 / Math.PI);
        return deg;
    }
    calcDistance(pos1, pos2) {
        const x = (pos2.x - pos1.x) ** 2;
        const y = (pos2.y - pos1.y) ** 2;
        return Math.sqrt(x + y);
    }
}

class GridAppGrid {
    constructor(config, initialOffset) {
        this._config = config;
        this._initialOffset = initialOffset;
        this._element = document.createElement('div');
        this._element.classList.add('app-grid');
        this._element.style.setProperty('--app-bg-grid-size', config.background.gridSize.toString());
        this._element.style.setProperty('--app-offset-x', this._initialOffset.x.toString());
        this._element.style.setProperty('--app-offset-y', this._initialOffset.y.toString());
        this._element.style.setProperty('--app-zoom', config.zoom.default.toString());
    }
    get element() {
        return this._element;
    }
    get initialOffset() {
        return this._initialOffset;
    }
    get config() {
        return this._config;
    }
}

class GridApp {
    constructor(appContainerElement, config) {
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
        this._appPanelElement = document.createElement('div');
        this._appPanelElement.classList.add('app-panel', 'open');
        this._element.append(this._appPanelElement);
        this._appPanelElement.style.setProperty('--app-panel-bg-color', config.panel.backgroundColor.join(', '));
        this._mouseDown = false;
        this._lastMousePosition = { x: 0, y: 0 };
        this._movingElement = null;
        this._registerEventListeners();
    }
    get element() {
        return this._element;
    }
    get gridElement() {
        return this._grid.element;
    }
    get config() {
        return this._config;
    }
    getOffset() {
        return {
            x: Number(this._grid.element.style.getPropertyValue('--app-offset-x')),
            y: Number(this._grid.element.style.getPropertyValue('--app-offset-y')),
        };
    }
    updateOffset(move) {
        const currentOffset = this.getOffset();
        this._grid.element.style.setProperty('--app-offset-x', (currentOffset.x - move.x).toString());
        this._grid.element.style.setProperty('--app-offset-y', (currentOffset.y - move.y).toString());
    }
    getZoom() {
        return Number(this._grid.element.style.getPropertyValue('--app-zoom'));
    }
    updateZoom(zoom) {
        const currentZoom = this.getZoom();
        const newZoom = Math.min(this._config.grid.zoom.max, Math.max(this._config.grid.zoom.min, currentZoom + zoom));
        this._grid.element.style.setProperty('--app-zoom', newZoom.toString());
    }
    append(...components) {
        for (const component of components) {
            this._grid.element.append(component.element);
        }
    }
    _registerEventListeners() {
        window.addEventListener('pointerdown', (e) => {
            const target = e.target;
            if (!target.closest('.app-grid')) {
                return;
            }
            e.preventDefault();
            this._mouseDown = true;
            this._lastMousePosition = {
                x: e.clientX,
                y: e.clientY,
            };
            const componentconnectionElement = target.closest('.app-component-connector');
            console.log(componentconnectionElement);
            if (componentconnectionElement) {
                const zoom = this.getZoom();
                const offset = this.getOffset();
                const connection = new GridAppConnection();
                connection.setStartPosition(componentconnectionElement, {
                    x: (e.clientX - this._grid.initialOffset.x) / zoom + this._grid.initialOffset.x - offset.x,
                    y: (e.clientY - this._grid.initialOffset.y) / zoom + this._grid.initialOffset.y - offset.y,
                });
                this._grid.element.append(connection.element);
                this._movingElement = connection.element;
                this._movingElement.classList.add('moving');
                return;
            }
            const componentElement = target.closest('.app-component');
            if (componentElement) {
                componentElement.parentElement?.append(componentElement);
                this._movingElement = componentElement;
                this._movingElement.classList.add('moving');
                return;
            }
        });
        window.addEventListener('pointermove', (e) => {
            e.preventDefault();
            if (!this._mouseDown)
                return;
            const zoom = this.getZoom();
            const offset = this.getOffset();
            if (this._movingElement) {
                switch (this._movingElement.dataset['type']) {
                    case 'component': {
                        const element = this._movingElement;
                        element.gridComponent.move({
                            x: (this._lastMousePosition.x - e.clientX) / zoom,
                            y: (this._lastMousePosition.y - e.clientY) / zoom,
                        });
                        break;
                    }
                    case 'connection': {
                        const element = this._movingElement;
                        element.gridConnection.setEndPosition({
                            x: (e.clientX - this._grid.initialOffset.x) / zoom + this._grid.initialOffset.x - offset.x,
                            y: (e.clientY - this._grid.initialOffset.y) / zoom + this._grid.initialOffset.y - offset.y,
                        });
                        break;
                    }
                }
            }
            else {
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
        window.addEventListener('pointerup', (e) => {
            e.preventDefault();
            if (!this._mouseDown)
                return;
            const target = e.target;
            if (this._movingElement) {
                const zoom = this.getZoom();
                const offset = this.getOffset();
                switch (this._movingElement.dataset['type']) {
                    case 'connection': {
                        const element = this._movingElement;
                        const pointedElement = target.closest('.app-component-connector');
                        if (pointedElement) {
                            element.gridConnection.setEndPosition({
                                x: (e.clientX - this._grid.initialOffset.x) / zoom + this._grid.initialOffset.x - offset.x,
                                y: (e.clientY - this._grid.initialOffset.y) / zoom + this._grid.initialOffset.y - offset.y,
                            }, pointedElement);
                        }
                        else {
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
        window.addEventListener('wheel', (e) => {
            const target = e.target;
            if (!target.closest('.app-grid')) {
                return;
            }
            e.preventDefault();
            this.updateZoom(e.deltaY < 0 ? this._config.grid.zoom.step : -this._config.grid.zoom.step);
        }, { passive: false });
    }
}

class GridAppComponent {
    constructor(config, position) {
        this._element = document.createElement('div');
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
    get element() {
        return this._element;
    }
    get headElement() {
        return this._element.querySelector('.app-component-head');
    }
    get bodyElement() {
        return this._element.querySelector('.app-component-body');
    }
    getPosition() {
        return {
            x: Number(this._element.style.getPropertyValue('--x')),
            y: Number(this._element.style.getPropertyValue('--y')),
        };
    }
    setTitle(value) {
        this.headElement.innerText = value;
    }
    move(move) {
        const position = this.getPosition();
        this._element.style.setProperty('--x', (position.x - move.x).toString());
        this._element.style.setProperty('--y', (position.y - move.y).toString());
    }
}

const gridAppConfig = {
    grid: {
        background: {
            gridSize: 10,
        },
        zoom: {
            default: 2,
            min: 1,
            max: 10,
            step: 0.1,
        },
        offset: {
            x: 0,
            y: 0,
        },
    },
    component: {
        backgroundColor: [40, 46, 48],
        textColor: [167, 178, 184],
    },
    group: {
        backgroundColor: [197, 116, 218],
    },
    panel: {
        backgroundColor: [255, 255, 255],
    },
};
const gridAppElement = document.getElementById('gridApp');
const app = new GridApp(gridAppElement, gridAppConfig);
const component = new GridAppComponent(gridAppConfig.component, { x: -100, y: -100 });
component.setTitle('Component 1');
const component2 = new GridAppComponent(gridAppConfig.component, { x: 100, y: 100 });
component2.setTitle('Component 2');
app.append(component, component2);
