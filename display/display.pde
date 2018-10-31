int c;
ArrayList<PImage> scr = new ArrayList<PImage>();
String mask = "ABIJCDKLQRYZST01EFMNGHOPUV23WX4567:;89_#&{/\\}(+=.?><,!%@)[*-]\"^$";
void setup() {
  for(int i = 0; i <= 84; i++){
    String fName = "SCR_" + Integer.toString(i) + ".png";
    scr.add(loadImage(fName));
  }
  fullScreen();
  background(0);
  textFont(createFont("Consolas", 320));
  textAlign(CENTER);
  fill(255);
  c = 0;
}
int currentState = 0;
final int UPPERLEFT = 1;
final int UPPERRIGHT = 2;
final int LOWERLEFT = 3;
final int LOWERRIGHT = 4;
void disp(int part){

  switch(part) {
    case UPPERLEFT:
    image(scr.get(currentState*4+1), 0, 0);
    break;
    case UPPERRIGHT:
    image(scr.get(currentState*4+2), width/2, 0);
    break;
    case LOWERLEFT:
    image(scr.get(currentState*4+3), 0, height/2);
    break;
    case LOWERRIGHT:
    image(scr.get(currentState*4+4), width/2, height/2);
    break;
  }
}
void draw() {
  background(0);
  if(c % 4 < 2)
  disp(UPPERLEFT);
  if(c % 6 < 3)
  disp(UPPERRIGHT);
  if(c % 14 < 7)
  disp(LOWERLEFT);
  if(c % 20 < 10)
  disp(LOWERRIGHT);
  c++;
}

void keyPressed() {
  if (keyPressed) {
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
  if(currentState >= 21 && currentState <= 84){
    println(mask.charAt(currentState - 21));
    currentState = 0;
  }
}
