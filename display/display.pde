char dataIn;
boolean haltState = false;
long c;
ArrayList<PImage> scr = new ArrayList<PImage>();
String mask = "ABIJCDKLQRYZST01EFMNGHOPUV23WX4567:;89_#&{/\\}(+=.?><,!%@)[*-]\"^$";
StringBuilder currentString = new StringBuilder();
void setup() {
  for(int i = 0; i <= 84; i++){
    String fName = "SCR_" + Integer.toString(i) + ".png";
    scr.add(loadImage(fName));
  }
  fullScreen(P2D);
  background(0);
  textAlign(CENTER);
  fill(255);
  c = 0;
  frameRate(60);

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
  println(frameRate);
  String[] lines = loadStrings("C:/Users/User/Desktop/socket.txt");
  if(lines.length < 1 || lines[0].length() < 1){
    ;
  }else if(lines[0].charAt(0) != '0' && lines[0].charAt(0) != '5'){
    dataIn = lines[0].charAt(0);
    String[] wlines = {"5"};
    saveStrings("C:/Users/User/Desktop/socket.txt",wlines);
    haltState = true;
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

void keyPressed() {
  if (keyPressed) {
    String[] wlines = {"0"};
    saveStrings("C:/Users/User/Desktop/socket.txt",wlines);
    haltState = false;
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
    currentString.setLength(0);
    currentState = 0;
  }else if(currentState >= 21 && currentState < 84){
    currentString.append(mask.charAt(currentState - 21));
    currentState = 0;
  }
}
