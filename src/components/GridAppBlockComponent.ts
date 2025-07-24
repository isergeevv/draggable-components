import GridAppLineConnector from '../connectors/GridAppLineConnector';
import GridAppComponent from '../core/GridAppComponent';

export default class GridAppBlockComponent extends GridAppComponent {
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

  get headElement(): HTMLDivElement {
    return this.element.querySelector(`.${this.class}-head`) as HTMLDivElement;
  }

  get bodyElement(): HTMLDivElement {
    return this.element.querySelector(`.${this.class}-body`) as HTMLDivElement;
  }

  getTitle(): string {
    return this.headElement.innerText;
  }
  setTitle(value: string): void {
    this.headElement.innerText = value;
  }

  getBody(): string {
    return this.bodyElement.innerText;
  }
  setBody(value: string): void {
    this.bodyElement.innerText = value;
  }
}
