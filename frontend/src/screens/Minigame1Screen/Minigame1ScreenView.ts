import Konva from "konva";

export class Minigame1ScreenView {
  private group: Konva.Group;
  private layer: Konva.Layer;

  private startButton: Konva.Rect;
  private scoreText: Konva.Text;

  constructor(layer: Konva.Layer) {
    this.layer = layer;
    this.group = new Konva.Group({ visible: false });

    // Score text
    this.scoreText = new Konva.Text({
      x: 50,
      y: 50,
      text: "Score: 0",
      fontSize: 30,
      fill: "white",
    });
    this.group.add(this.scoreText);

    // Start button
    this.startButton = new Konva.Rect({
      x: 100,
      y: 200,
      width: 200,
      height: 80,
      fill: "green",
      cornerRadius: 10,
    });
    this.group.add(this.startButton);

    // Add to layer
    this.layer.add(this.group);
  }

  getGroup(): Konva.Group {
    return this.group;
  }

  show(): void {
    this.group.visible(true);
    this.layer.draw();
  }

  hide(): void {
    this.group.visible(false);
    this.layer.draw();
  }

  onStartClicked(callback: () => void): void {
    this.startButton.on("click", callback);
  }

  updateScore(score: number): void {
    this.scoreText.text(`Score: ${score}`);
    this.layer.draw();
  }
}
