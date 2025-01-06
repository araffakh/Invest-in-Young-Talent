#include <LiquidCrystal_I2C.h>
int sensor=A0;
int gled=2;
int rled=3;

LiquidCrystal_I2C lcd(0X27,6,2);

void setup() {
  pinMode(gled,OUTPUT);
  pinMode(rled,OUTPUT);
  
  lcd.begin(16,2);
  lcd.init();
  lcd.backlight();
}

void loop() {
  int sensorValue = analogRead(sensor); 
  float mv = (sensorValue/ 1024.0) * 5000;  
  float cel=(mv/10);
  
  
  if (cel > 30) { 
    digitalWrite(rled, HIGH);
    digitalWrite(gled, LOW);
  } else {
    digitalWrite(rled, LOW);  
    digitalWrite(gled, HIGH);
  }

  lcd.setCursor(0,0);
  lcd.print("Temp in cel:");
  lcd.setCursor(0,1);
  lcd.print(cel);
}










