int led1=13;
char recievedData;

void setup() {
  Serial.begin(9600);
  pinMode(led1,OUTPUT);
}

void loop() {
  if(Serial.available() > 0){
    recievedData = Serial.read();
    if(recievedData == '1') {
      digitalWrite(led1, HIGH);
    }
    else if(recievedData == '0'){
      digitalWrite(led1, LOW);
    }
  }
}
