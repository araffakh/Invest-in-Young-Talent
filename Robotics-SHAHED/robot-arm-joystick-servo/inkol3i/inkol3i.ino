#include <Servo.h>

Servo servoX;  // إنشاء كائن للسيرفو الأول X
Servo servoY;  // إنشاء كائن للسيرفو الأول Y

int joyX; // متغير لتخزين قيمة محور X
int joyY; // متغير لتخزين قيمة محور Y
int posX = 0;  // موضع السيرفو اكس الحالي
int posY = 0; // موضع السيرفو واي الحالي
int speedX = 0; // سرعة تحريك السيرفو اكس
int speedY = 0; // سرعة تحريك السيرفو واي
int prevX = 512;  // القيمة السابقة للمحور X (مبدئياً تكون منتصف النطاق)
int prevY = 512;  // القيمة السابقة للمحور Y (مبدئياً تكون منتصف النطاق)
int lastDeltaX = 0; // سرعة تحريك الjoyX السابقة
int lastDeltaY = 0; // سرعة تحريك الjoyY السابقة

void setup() {
  servoX.attach(3);  // توصيل السيرفو اكس بالدبوس 3
  servoY.attach(9);  // توصيل السيرفو واي بالدبوس 9
}

void loop() {
  joyX = analogRead(A0); // قراءة قيمة الجويستيك من المحور X
  joyY = analogRead(A5); // قراءة قيمة الجويستيك من المحور Y

  // حساب التغير في القيم (فرق الحركة)
  int deltaX = abs(joyX - prevX);  // فرق القيمة بين الحالية والسابقة X
  int deltaY = abs(joyY - prevY);  // فرق القيمة بين الحالية والسابقة Y

  speedX = map(deltaX , 0 , 1023 , 0 , 30);
  speedY = map(deltaY , 0 , 1023 , 0 , 30);

  // تحويل القيمة من 0-1023 إلى 0-180
  int targetPosX = map(joyX, 0, 1023, 0, 180);
  int targetPosY = map(joyY, 0, 1023, 0, 180);

  // الانتقال التدريجي نحو الموضع المطلوب
  if (posX < targetPosX) {
    posX++; // زيادة الموضع
  } else if (posX > targetPosX) {
    posX--; // تقليل الموضع
  }

  if (posY < targetPosY) {
    posY++; // زيادة الموضع
  } else if (posY > targetPosY) {
    posY--; // تقليل الموضع
  }

  // تعيين موضع السيرفو
  servoX.write(posX);
  servoY.write(posY);

  if(lastDeltaX != deltaX){
    lastDeltaX = deltaX;
    delay(speedX);
  }
  else if(lastDeltaY != deltaY){
    lastDeltaY = deltaY;
    delay(speedY); 
  }

}