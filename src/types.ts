import GridAppComponent from './GridAppComponent';
import GridAppConnection from './GridAppConnection';
import GridAppGroup from './GridAppGroup';

export type RGBColor = [number, number, number];

export type GridAppHTMLElement = GridAppComponentHTMLElement | GridAppConnectionHTMLElement | GridAppGroupHTMLElement;

export interface Position {
  x: number;
  y: number;
}

export interface GridAppConnectionHTMLElement extends HTMLDivElement {
  gridConnection: GridAppConnection;
}

export interface GridAppComponentHTMLElement extends HTMLDivElement {
  gridComponent: GridAppComponent;
}

export interface GridAppGroupHTMLElement extends HTMLDivElement {
  gridGroup: GridAppGroup;
}

export interface GridAppGridBackgroundConfiguration {
  gridSize: number;
}

export interface GridAppGridConfiguration {
  background: GridAppGridBackgroundConfiguration;
  zoom: GridAppZoomConfiguration;
  offset: GridAppOffsetConfiguration;
}

export interface GridAppOffsetConfiguration {
  x: number;
  y: number;
}

export interface GridAppZoomConfiguration {
  default: number;
  min: number;
  max: number;
  step: number;
}

export interface GridAppComponentConfiguration {
  backgroundColor: RGBColor;
  textColor: RGBColor;
}

export interface GridAppGroupConfiguration {
  backgroundColor: RGBColor;
}

export interface GridAppPanelConfiguration {
  backgroundColor: RGBColor;
}

export interface GridAppConfiguration {
  grid: GridAppGridConfiguration;
  component: GridAppComponentConfiguration;
  group: GridAppGroupConfiguration;
  panel: GridAppPanelConfiguration;
}
