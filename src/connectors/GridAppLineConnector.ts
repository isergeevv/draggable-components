import GridAppConnector from '../core/GridAppConnector';

export default class GridAppLineConnector extends GridAppConnector {
  constructor(label: string) {
    super(label);
  }

  onConnectionStart(): void {
    // Implement connection start logic if needed
    console.log(`Connection started for ${this.class}`);
  }

  onConnectionEnd(): void {
    // Implement connection end logic if needed
    console.log(`Connection ended for ${this.class}`);
  }
}
