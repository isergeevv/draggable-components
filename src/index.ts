import GridAppBlockComponent from './components/GridAppBlockComponent';
import GridApp from './GridApp';
import { GridAppConfiguration } from './types';

const gridAppElement = document.getElementById('gridApp') as HTMLDivElement;

const gridAppConfig: GridAppConfiguration = {
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
