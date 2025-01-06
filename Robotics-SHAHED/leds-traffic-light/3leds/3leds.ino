

int lightsPins[3] = {12 , 10 , 11}; //green yellow red

void setup(){
    for(int i = 0 ; i < 3 ; i++){
        pinMode(lightsPins[i], OUTPUT);
    }
}

void loop(){
    for(int i = 0 ; i < 3 ; i++){
        digitalWrite(lightsPins[i], HIGH);
        if(i == 1){
            delay(200) ;       }
        else{
            delay(200);
        }
        digitalWrite(lightsPins[i], LOW);
    }

    digitalWrite(lightsPins[1], HIGH);
    delay(250);
    digitalWrite(lightsPins[1], LOW);
}