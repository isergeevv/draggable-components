class GridAppConnector {
    constructor(label) {
        this._label = label;
        this._element = document.createElement('div');
        this._element.gridConnector = this;
        this._element.classList.add(`app-component-connector`, this.class);
    }
    get element() {
        return this._element;
    }
    get class() {
        return `app-component-connector-${this._label}`;
    }
    get component() {
        const gridComponentElement = this._element.closest('.app-component');
        if (!gridComponentElement) {
            throw new Error('No grid component found for connector.');
        }
        return gridComponentElement.gridComponent;
    }
}

class GridAppLineConnector extends GridAppConnector {
    constructor(label) {
        super(label);
    }
    onConnectionStart() {
        // Implement connection start logic if needed
        console.log(`Connection started for ${this.class}`);
    }
    onConnectionEnd() {
        // Implement connection end logic if needed
        console.log(`Connection ended for ${this.class}`);
    }
}

class GridAppComponent {
    constructor(config) {
        this._type = config.type;
        this._element = document.createElement('div');
        this._element.gridComponent = this;
        this._element.classList.add('app-component', this.class);
        this._element.dataset['type'] = 'component';
        this._element.dataset['componentType'] = this._type;
        this._element.style.setProperty('--x', '0');
        this._element.style.setProperty('--y', '0');
        this.setBackgroundColor(config.defaultBackgroundColor);
        this.setTextColor(config.defaultTextColor);
    }
    get type() {
        return this._type;
    }
    get class() {
        return `app-component-${this._type}`;
    }
    get element() {
        return this._element;
    }
    getBackgroundColor() {
        const bgColor = this._element.style.getPropertyValue('--app-component-bg-color');
        return bgColor ? bgColor.split(',').map(Number) : [0, 0, 0];
    }
    setBackgroundColor(color) {
        this._element.style.setProperty('--app-component-bg-color', color.join(', '));
    }
    getTextColor() {
        const textColor = this._element.style.getPropertyValue('--app-component-text-color');
        return textColor ? textColor.split(',').map(Number) : [0, 0, 0];
    }
    setTextColor(color) {
        this._element.style.setProperty('--app-component-text-color', color.join(', '));
    }
    getPosition() {
        return {
            x: Number(this._element.style.getPropertyValue('--x')),
            y: Number(this._element.style.getPropertyValue('--y')),
        };
    }
    setPosition(position) {
        this._element.style.setProperty('--x', position.x.toString());
        this._element.style.setProperty('--y', position.y.toString());
    }
    move(move) {
        const position = this.getPosition();
        this.setPosition({
            x: position.x - move.x,
            y: position.y - move.y,
        });
    }
}

class GridAppBlockComponent extends GridAppComponent {
    constructor() {
        super({
            type: 'block',
            defaultBackgroundColor: [40, 46, 48],
            defaultTextColor: [167, 178, 184],
        });
        const componentHeadElement = document.createElement('div');
        componentHeadElement.classList.add(`${this.class}-head`);
        componentHeadElement.innerText = 'Title';
        this.element.append(componentHeadElement);
        const componentBodyElement = document.createElement('div');
        componentBodyElement.classList.add(`${this.class}-body`);
        componentBodyElement.innerText = 'ASD';
        this.element.append(componentBodyElement);
        const leftConnector = new GridAppLineConnector('left');
        const rightConnector = new GridAppLineConnector('right');
        this.element.append(leftConnector.element, rightConnector.element);
    }
    get headElement() {
        return this.element.querySelector(`.${this.class}-head`);
    }
    get bodyElement() {
        return this.element.querySelector(`.${this.class}-body`);
    }
    getTitle() {
        return this.headElement.innerText;
    }
    setTitle(value) {
        this.headElement.innerText = value;
    }
    getBody() {
        return this.bodyElement.innerText;
    }
    setBody(value) {
        this.bodyElement.innerText = value;
    }
}

class GridAppGrid {
    constructor(config, initialOffset) {
        this._config = config;
        this._initialOffset = initialOffset;
        this._element = document.createElement('div');
        this._element.classList.add('app-grid');
        this._element.style.setProperty('--app-bg-grid-size', config.size.toString());
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
    setStartElement(element) {
        this._startElement = element;
    }
    setEndElement(element) {
        this._endElement = element;
    }
}

class GridAppLineConnection extends GridAppConnection {
    constructor() {
        super();
    }
    setStartPosition(element, position) {
        this.setStartElement(element);
        this.element.style.setProperty('--x1', position.x.toString());
        this.element.style.setProperty('--y1', position.y.toString());
        this.element.style.setProperty('--deg', '0');
    }
    setEndPosition(position, element) {
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

class GridApp {
    constructor(appContainerElement, config, customComponents = []) {
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
    get element() {
        return this._element;
    }
    get gridElement() {
        return this._grid.element;
    }
    get config() {
        return this._config;
    }
    get components() {
        return this._components;
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
            console.log(component.element);
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

const gridAppElement = document.getElementById('gridApp');
const gridAppConfig = {
    grid: {
        size: 10,
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
    panel: {
        backgroundColor: [255, 255, 255],
    },
};
const app = new GridApp(gridAppElement, gridAppConfig);
const component = new GridAppBlockComponent();
component.setTitle('Component 1');
const component2 = new GridAppBlockComponent();
component2.setTitle('Component 2');
app.append(component, component2);
