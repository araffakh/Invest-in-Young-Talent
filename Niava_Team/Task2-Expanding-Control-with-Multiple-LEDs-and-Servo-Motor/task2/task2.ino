int leds[4]={13,12,11,10};
int brightLed = 9;
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
  Serial.begin(115200);
}

void loop() {
  recieve();
  send();
}

void recieve(){
  if(Serial.available() > 0){
    String get_data = Serial.readStringUntil("\n");
    if(get_data.length() == 3){
      char ledletter = get_data.charAt(0);
      char ledStatus = get_data.charAt(1);
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
    else if(get_data.length() > 3){
      String get_ledBright = get_data.substring(2);
      int ledBrightness = get_ledBright.toInt();
      analogWrite(brightLed, ledBrightness);
      brightnessValue = ledBrightness;
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
