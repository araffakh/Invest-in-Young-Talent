#include <Server.h>
Servo myServo;
int leds[4]={13,12,11,10};
int brightLed = 9;
int servoPin = 6;
int brightnessValue = 0;
int data_send[5];
void recieve();
void send();
unsigned long previousMillis = 0;
const long interval = 5000;

void setup() {
  for (int i=0;i<sizeof(leds)/sizeof(leds[0]);i++){
    pinMode(leds[i],OUTPUT);
  }
  pinMode(brightLed,OUTPUT);
  myServo.attach(servoPin);
  Serial.begin(115200);
}

void loop() {
  recieve();
  send();
}

void recieve(){
  if(Serial.available() > 0){
    String get_data = Serial.readStringUntil("\n");
    if(get_data.charAt(0) == 'L'){
      char ledletter = get_data.charAt(1);
      char ledStatus = get_data.charAt(2);
      int ledNumber = ledletter - '0';
      if(ledNumber == 5){
        if(ledStatus == '1'){
          digitalWrite(brightLed, HIGH);
        }
        else if(ledStatus == '0'){
          digitalWrite(brightLed, LOW);
        }
      }
      else{
        if(ledStatus == '1'){
          digitalWrite(leds[ledNumber-1], HIGH);
        }
        else if(ledStatus == '0'){
          digitalWrite(leds[ledNumber-1], LOW);
        }
      }
    }
    else if(get_data.charAt(0) == 'B'){
      String get_ledBright = get_data.substring(2);
      int ledBrightness = get_ledBright.toInt();
      analogWrite(brightLed, ledBrightness);
      brightnessValue = ledBrightness;
    }
    else if(get_data.charAt(0) == 'S'){
      String value = get_data.substring(2);
      int array_length = 0;
      for(int i = 0 ; i < value.length() ; i++){
        if(value.charAt(i) == '-'){
          array_length++;
        }
      }

      String servo_values[array_length];
      array_length = 0;

      for(int i = 1 ; i < value.length() ; i++){
        if(value.charAt(i) == '-'){
          if(value.charAt(i - 4) == '-'){
            servo_values[array_length] = value.substring(i-3,i);
          }
          else if(value.charAt(i - 3) == '-'){
            servo_values[array_length] = value.substring(i-2,i);
          }
          else if(value.charAt(i - 2) == '-'){
            servo_values[array_length] = value.substring(i-1,i);
          }
          array_length++;
        }
      }

      for(int i = 0 ; i < sizeof(servo_values) / sizeof(servo_values[0]) ; i++){
        myServo.write(servo_values[i].toInt());
        delay(500);
      }
    }
  }
}

void send(){
  unsigned long currentMillis = millis();
  if(currentMillis - previousMillis >= interval){
    for (int i=0;i<sizeof(leds)/sizeof(leds[0]);i++){
      data_send[i] = digitalRead(leds[i]);
    }
    Serial.print(brightnessValue);
    Serial.print(',');
    for (int i=0;i<sizeof(leds)/sizeof(leds[0]);i++){
      Serial.print(data_send[i]);
      if(i < sizeof(leds)/sizeof(leds[0]) - 1){
        Serial.print('-');
      }
    }
    Serial.println();
    previousMillis = currentMillis;
  }
}
