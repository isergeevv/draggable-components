import GridApp from './GridApp';
import GridAppComponent from './GridAppComponent';
import { GridAppConfiguration } from './types';

const gridAppConfig: GridAppConfiguration = {
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

const gridAppElement = document.getElementById('gridApp') as HTMLDivElement;

const app = new GridApp(gridAppElement, gridAppConfig);

const component = new GridAppComponent(gridAppConfig.component, { x: -100, y: -100 });
component.setTitle('Component 1');

const component2 = new GridAppComponent(gridAppConfig.component, { x: 100, y: 100 });
component2.setTitle('Component 2');

app.append(component, component2);
