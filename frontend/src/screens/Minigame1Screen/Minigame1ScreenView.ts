import Konva from "konva";
import type { View } from "../../types";
import { CONTENT_HEIGHT, CONTENT_WIDTH, STAGE_HEIGHT, STAGE_WIDTH } from "../../constants";


export class Minigame1ScreenView implements View{
    private group: Konva.Group;
    private layer: Konva.Layer;
    private introGroup: Konva.Group;
    private questionGroup: Konva.Group;
    private feedbackGroup: Konva.Group;
    private htmlInput: HTMLInputElement;

    // --- Question UI elements ---
    private sequenceText: Konva.Text;
    private correctText: Konva.Text;
    private timerText: Konva.Text;
    private inputText: Konva.Text;
    private inputBox: Konva.Rect;
    private inputGroup: Konva.Group;
    private submitBtn: Konva.Group;
    private feedback!: Konva.Text;
    private feedbackBox!: Konva.Rect;

    // handle submit
    onSubmit?: (answer: string) => void;


  constructor(layer: Konva.Layer) {
    this.layer = layer;
    this.group = new Konva.Group({ visible: false });
    
///Html
    this.htmlInput = document.createElement("input");
    this.htmlInput.style.position = "absolute";
    this.htmlInput.style.display = "none";
    this.htmlInput.style.fontSize = "20px";
    document.body.appendChild(this.htmlInput); 
////Html

    // --- Add background image ---
    Konva.Image.fromURL("desertBg.jpg", (bgImage: Konva.Image) => {
          bgImage.x(0);
          bgImage.y(0);
          bgImage.width(STAGE_WIDTH);
          bgImage.height(STAGE_HEIGHT);
          this.group.add(bgImage);
          bgImage.moveToBottom();
        });

    /***
     * IntroGroup--------------------------
     * */
    this.introGroup = new Konva.Group({});
    this.group.add(this.introGroup);
    
    const startButtonGroup = new Konva.Group({
        name: "startGameButton",  
    });

    const cardWidth = 400;
    const cardHeight = 250;

    const introCard = new Konva.Rect({
      x: (STAGE_WIDTH - cardWidth) / 2,
      y: (STAGE_HEIGHT - cardHeight) / 2,
      width: cardWidth,
      height: cardHeight,
      fill: "rgba(255,255,255,0.6)", // 半透明白色
      cornerRadius: 15,
      stroke: "#333",
      strokeWidth: 2,
    });
    this.introGroup.add(introCard);

    // --- Intro text ---
    const introText = new Konva.Text({
      x: introCard.x() + 20,
      y: introCard.y() + 20,
      width: cardWidth - 40,
      text: "Welcome to MiniGame 1!\nFind out the rules and answer the missing area.\nAre you ready?",
      fontSize: 20,
      fontFamily: "Calibri",
      fill: "#222",
      align: "center",
    });
    this.introGroup.add(introText);

    // START GAME BUTTON
    const buttonWidth = 180;
    const buttonHeight = 50;

    const startButton = new Konva.Rect({
      x: introCard.x() + (cardWidth - buttonWidth) / 2,
      y: introCard.y() + cardHeight - buttonHeight - 20,
      width: buttonWidth,
      height: buttonHeight,
      fill: "#7db9ff",
      cornerRadius: 12,
      shadowColor: "black",
      shadowBlur: 10,
      shadowOffset: { x: 2, y: 2 },
    });
    

    const buttonLabel = new Konva.Text({
      x: startButton.x(),
      y: startButton.y() + 12,
      width: buttonWidth,
      text: "Start Game",
      fontSize: 22,
      align: "center",
      fill: "white",
      fontStyle: "bold",
    });
    startButtonGroup.add(startButton);
    startButtonGroup.add(buttonLabel);
    this.introGroup.add(startButtonGroup);
   
    // BUTTON INTERACTION (hover)
    startButtonGroup.on("mouseenter", () => {
      startButton.fill("#3681d6ff");
      this.layer.draw();
    });
    startButtonGroup.on("mouseleave", () => {
      startButton.fill("#7db9ff");
      this.layer.draw();
    });

    // exported event: controller will listen to this
    startButton.name("startGameButton");
    buttonLabel.name("startGameButton");

    /***
     * QuestionGroup--------------------------
     * */
    this.questionGroup = new Konva.Group({ visible: false });
    this.group.add(this.questionGroup);

    const qCard = new Konva.Rect({
      x: (STAGE_WIDTH-800) / 2,
      y: (STAGE_HEIGHT-500) / 2,
      width: 800,
      height: 500,
      fill: "rgba(0,0,0,0.45)",
      cornerRadius: 20,
    });
    this.questionGroup.add(qCard);


    this.correctText = new Konva.Text({
      x: qCard.x() + 20,
      y: qCard.y() - 40,
      text: "Correct: 0",
      fontSize: 24,
      fill: "white",
      fontStyle: "bold",
    });
    this.questionGroup.add(this.correctText);

    this.timerText = new Konva.Text({
      x: qCard.x() + qCard.width() - 120,
      y: qCard.y() - 40,
      text: "Time: 30",
      fontSize: 24,
      fill: "yellow",
      fontStyle: "bold",
    });
    this.questionGroup.add(this.timerText);
    

    //showing sequence text
    /**
     * TODO: need to adjust the size and position and add ? at the end
     * Then consider the next line  position for the input and submit button
     */
    this.sequenceText = new Konva.Text({
        x: qCard.x() + 20,
        y: qCard.y() + 40,
        width: 460,
        fontSize: 28,
        fill: "white",
        align: "center"
        });
    this.questionGroup.add(this.sequenceText);

    // input box group
    this.inputGroup = new Konva.Group({
        x: qCard.x() + 20,
        y: qCard.y() + 120
    });
    this.questionGroup.add(this.inputGroup);

    // input background box
    this.inputBox = new Konva.Rect({
        width: 100,
        height: 40,
        fill: "white",
        stroke: "black",
        cornerRadius: 6
    });
    this.inputGroup.add(this.inputBox);

    // Konva text inside input box (shows the number typed)
    this.inputText = new Konva.Text({
        x: 10,
        y: 8,
        text: "",
        fontSize: 20,
        fill: "black"
        });
    this.inputGroup.add(this.inputText);

    //html
    this.inputGroup.on("click", () => {
        const absPos = this.inputGroup.absolutePosition();

        this.htmlInput.style.left = absPos.x + "px";
        this.htmlInput.style.top = absPos.y + "px";
        this.htmlInput.style.width = "100px";
        this.htmlInput.style.height = "40px";
        this.htmlInput.style.display = "block";

        this.htmlInput.focus();

        this.htmlInput.oninput = () => {
            this.inputText.text(this.htmlInput.value);
            this.layer.draw();
        };
    });

    //submit button
    this.submitBtn = new Konva.Group({
        x: qCard.x() + 140,
        y: qCard.y() + 120,
        name: "submitAnswer"
        });
    this.questionGroup.add(this.submitBtn);

    const submitRect = new Konva.Rect({
        width: 80,
        height: 40,
        fill: "#6bd66b",
        cornerRadius: 6
        });
    this.submitBtn.add(submitRect);

    const submitText = new Konva.Text({
        x: 0,
        y: 10,
        width: 80,
        text: "OK",
        fontSize: 20,
        align: "center",
        fill: "white"
        });
    this.submitBtn.add(submitText);

    this.submitBtn.on("mouseenter", ()=>{
        submitRect.fill("#a0dba0ff");
    });
    this.submitBtn.on("mouseleave", () =>{
        submitRect.fill("#6bd66b");
    })

    this.submitBtn.on("click", () => {
      const val = this.htmlInput.value.trim();
      if(val && this.onSubmit){
        console.log("on submit execute");
        this.htmlInput.value=""; //clear the answer
        this.onSubmit(val);
        
      }
    });

    // Feekback: correct/wrong
    /**
     * TODO: change color which green for correct and red for wrong
     */
    this.feedbackGroup = new Konva.Group({});
    this.group.add(this.feedbackGroup);

    this.feedbackBox = new Konva.Rect({
      x: qCard.x() + qCard.width()/20,
      y: qCard.y() + qCard.height()/2,
      width: (qCard.width()/10)*9,
      // width: contentBox.width(),
      height: (qCard.height()/10)*2,
      fill: '',
      stroke:'',
      opacity: 0.9
  });
    this.feedbackGroup.add(this.feedbackBox);
    
    this.feedback = new Konva.Text({
        x: this.feedbackBox.x(), //should be middle of box
        y: this.feedbackBox.y(), 
        width: this.feedbackBox.width(),
        height: this.feedbackBox.height(),
        align: 'center',
        fontSize: this.feedbackBox.height(),
        stroke: 'black',
        strokeWidth: 2,
        text: "feedback",
        fill: 'grey',
    });
    this.feedbackGroup.add(this.feedback);
    // this.feedbackGroup.visible(false);
    
    /***
     * NEED to CHANGE!!!!!!!!!!!-----------------
     * */
    // this.questionText = new Konva.Text({
    //   x: qCard.x() + 20,
    //   y: qCard.y() + 90,
    //   width: 460,
    //   text: "1 + 1 = ?",
    //   fontSize: 32,
    //   fill: "white",
    //   align: "center",
    //   fontStyle: "bold",
    // });
    // this.questionGroup.add(this.questionText);

    // this group has 2 sub-groups: introGroup and questionGroup
    this.layer.add(this.group);
  }

    // --------------------------  
    /***
     * ---------------------------------------------------------------------------------!!!!!!!!!!!-----------------
     * */

    hideIntro() {
        this.introGroup.visible(false);
        this.layer.draw();
    }

    showQuestionBox() {
        this.questionGroup.visible(true);
        this.layer.draw();
    }
    /*
    ---------------feed back-----------------
    */
    showFeedback(){
        this.feedbackGroup.visible(true);
        this.layer.draw();
    }
    hideFeedback(){
      this.feedbackGroup.visible(false);
      this.layer.draw();
    }
    updateFeedback(rate:number){
        //rate should be 0,1,2 (0 for incorrect, 1,2 for correct)
        switch (rate) {
            case 0:
                this.feedback.text("TRY AGAIN!");
                this.feedbackBox.fill('red');
                break;
            case 1:
                this.feedback.text("GOOD JOB!");
                this.feedbackBox.fill('green');
                break;
            case 2:
                this.feedback.text("AWESOME!");
                this.feedbackBox.fill('green');
                break;
        }
        this.group.getLayer()?.draw();
    }
//show the question with  ",  ___ ?";
    displayQuestion(question: string) {
        const display = question + ",  ___ ?";
        this.sequenceText.text(display);
        this.layer.draw();
    }

    updateCorrect(correct: number) {
        this.correctText.text(`Correct: ${correct}`);
        this.layer.draw();
    }

    updateTime(timeLeft: number) {
        this.timerText.text(`Time: ${timeLeft}`);
        this.layer.draw();
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
}
  
   