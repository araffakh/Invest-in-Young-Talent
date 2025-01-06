const int ledPin = 13;             // المخرج الرقمي المتصل بـ LED
const int buttonPin = 7;     // الدخل الرقمي المتصل بزر الضغط

// متغير لتخزين حالة الزر
int buttonState = 0;

void setup() {
  // تهيئة المخرج الرقمي للـ LED كخرج
  pinMode(ledPin, OUTPUT);
  
  // تهيئة الدخل الرقمي للزر كدخل
  pinMode(buttonPin, INPUT);
}

void loop() {
  // قراءة حالة الزر
  buttonState = digitalRead(buttonPin);
  
  // إذا تم ضغط الزر، تشغيل LED
  if (buttonState == HIGH) {
    digitalWrite(ledPin, HIGH);  // تشغيل LED
  } else {
    digitalWrite(ledPin, LOW);   // إطفاء LED
  }
}
