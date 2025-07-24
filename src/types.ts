import GridAppComponent from './core/GridAppComponent';
import GridAppConnector from './core/GridAppConnector';
import GridAppConnection from './core/GridAppConnection';

export type RGBColor = [number, number, number];

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

export interface GridAppConnectorHTMLElement extends HTMLDivElement {
  gridConnector: GridAppConnector;
}

export interface GridAppGridConfiguration {
  size: number;
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
  type: string;
  defaultBackgroundColor: RGBColor;
  defaultTextColor: RGBColor;
}

export interface GridAppGroupConfiguration {
  backgroundColor: RGBColor;
}

export interface GridAppPanelConfiguration {
  backgroundColor: RGBColor;
}

export interface GridAppConfiguration {
  grid: GridAppGridConfiguration;
  panel: GridAppPanelConfiguration;
}

export type GridAppComponentConstructor = new (config: GridAppComponentConfiguration) => GridAppComponent;

export interface GridAppComponentData {
  type: string;
  component: GridAppComponentConstructor;
}
