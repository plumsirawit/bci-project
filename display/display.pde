import processing.net.*;
import controlP5.*;

ControlP5 cp5;

char dataIn;
boolean haltState = false;
long c;
ArrayList<PImage> scr = new ArrayList<PImage>();
String mask = "ABIJCDKLQRYZST01EFMNGHOPUV23WX4567:;89_#&{/\\}(+=.?><,!%@)[*-]\"^$";
StringBuilder currentString = new StringBuilder();
String sendMessageUrl = "https://us-central1-bci-chat-app.cloudfunctions.net/sendMessage";
String newBCIUrl = "https://us-central1-bci-chat-app.cloudfunctions.net/newBCI";
String setNameUrl = "https://us-central1-bci-chat-app.cloudfunctions.net/setName";
String UID;
Client LSLClient;
boolean regisName = false;
void setup() {
  for(int i = 0; i <= 84; i++){
    String fName = "SCR_" + Integer.toString(i) + ".png";
    scr.add(loadImage(fName));
  }
  fullScreen(P2D);
  cp5 = new ControlP5(this);
  background(0);
  textAlign(CENTER);
  fill(255);
  c = 0;
  frameRate(60);
  LSLClient = new Client(this, "127.0.0.1", 5204);
  UID = loadStrings(newBCIUrl)[0];
  cp5.addTextfield("Name")
  .setCaptionLabel("")
  .setPosition(width/2 - 100, height/2 + 20)
  .setSize(200,40)
  .setFont(createFont("Consolas", 32))
  .setAutoClear(false);
  
  cp5.addButton("OK")
  .setPosition(width/2 - 50, height/2 + 70)
  .setSize(100, 40)
  .setValue(0);
}
public void OK(int theValue) {
  String name = cp5.get(Textfield.class, "Name").getText();
  if(name.length() > 0){
    cp5.get(Textfield.class, "Name").hide();
    cp5.get(Button.class, "OK").hide();
    regisName = true;
    loadStrings(setNameUrl + "?UID=" + UID + "&name=" + name);
  }
}
int currentState = 0;
final int UPPERLEFT = 1;
final int UPPERRIGHT = 2;
final int LOWERLEFT = 3;
final int LOWERRIGHT = 4;
long syncTime(){
  long ml = System.currentTimeMillis();
  double mld = ml;
  double rf = mld*60.0/1000.0;
  long rl = (long)rf;
  return rl;
}
void disp(int part){
  switch(part) {
    case UPPERLEFT:
    image(scr.get(currentState*4+1), 0, 0, width/3, height/3);
    break;
    case UPPERRIGHT:
    image(scr.get(currentState*4+2), 2*width/3, 0, width/3, height/3);
    break;
    case LOWERLEFT:
    image(scr.get(currentState*4+3), 0, 2*height/3, width/3, height/3);
    break;
    case LOWERRIGHT:
    image(scr.get(currentState*4+4), 2*width/3, 2*height/3, width/3, height/3);
    break;
  }
}
void draw() {
  //println(frameRate);
  if(!regisName){
    background(0);
    textFont(createFont("Consolas", 32));
    text("Please enter your name:", width/2, height/2);
    text("Your PIN is " + UID, width/2, height/2 + 200);
  }else{
    if(LSLClient.available() > 0){
      dataIn = LSLClient.readChar();
      currentState *= 4;
      currentState += dataIn - 48;
    }
    if(!haltState){
      background(0);
      if(c > 60)
        c = syncTime();
      if(c % 4 < 2)
      disp(UPPERLEFT);
      if(c % 5 < 3)
        disp(UPPERRIGHT);
      if(c % 6 < 3)
        disp(LOWERLEFT);
      if(c % 7 < 4)
        disp(LOWERRIGHT);
      c++;
      textFont(createFont("Consolas", 32));
      text(currentString.toString(), width/2, height/2);
    }else{
      background(0);
      textFont(createFont("Consolas", 320));
      text(Character.toString(dataIn),500,500);
    }
  }
}

void keyPressed() {
  if (keyPressed) {
    c = syncTime();
    switch (key) {
      case '1':
      currentState *= 4;
      currentState += 1;
      break;
      case '2':
      currentState *= 4;
      currentState += 2;
      break;
      case '3':
      currentState *= 4;
      currentState += 3;
      break;
      case '4':
      currentState *= 4;
      currentState += 4;
      break;
      case 'r':
      currentState = 0;
      break;
    }
  }
  if(currentState == 84){
    loadStrings(sendMessageUrl + "?UID=" + UID + "&message=" + currentString.toString());
    currentString.setLength(0);
    currentState = 0;
  }else if(currentState >= 21 && currentState < 84){
    currentString.append(mask.charAt(currentState - 21));
    currentState = 0;
  }
}
