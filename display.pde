
int c;
void setup() {
  fullScreen();
  background(0);
  textFont(createFont("Consolas", 320));
  textAlign(CENTER);
  fill(255);
  c = 0;
}

final int UPPERLEFT = 1;
final int UPPERRIGHT = 2;
final int LOWERLEFT = 3;
final int LOWERRIGHT = 4;
void display(int part){
  switch(part) {
    case UPPERLEFT:
    text("A", width/4, height/4+80);
    break;
    case UPPERRIGHT:
    text("B", 3*width/4, height/4+80);
    break;
    case LOWERLEFT:
    text("C", width/4, 3*height/4+80);
    break;
    case LOWERRIGHT:
    text("D", 3*width/4, 3*height/4+80);
    break;
  }
}
void draw() {
  background(0);
  if(c % 4 < 2)
  display(UPPERLEFT);
  if(c % 6 < 3)
  display(UPPERRIGHT);
  if(c % 14 < 7)
  display(LOWERLEFT);
  if(c % 20 < 10)
  display(LOWERRIGHT);
  c++;
}

void keyPressed() {
  if (keyPressed) {
    switch (key) {
      case '1':
      fill(255,0,0);
      break;
      case '2':
      fill(0,255,0);
      break;
      case '3':
      fill(0,0,255);
      break;
      case '4':
      fill(255,255,255);
      break;
    }
  }
}
