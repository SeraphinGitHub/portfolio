
// =====================================================================
// ParticulesClass
// =====================================================================
export class ParticulesClass {

   imageMap:   any;
   
   id:         number;
   x:          number;
   y:          number;
   height:     number;
   width:      number;
   gradient:   CanvasGradient;

   size:       number;
   velocity:   number;
   speed:      number;
   maxSpeed:   number = 2.5; // Max brightness ==> 255, shorten as 2.5 for better perf 

   pixelColor: string = "";

   constructor(
      imageMap:  any,
      id:        number,
      width:     number,
      height:    number,
      gradient:  CanvasGradient,
      veloCoeff: number,
   ) {
      this.imageMap = imageMap;
      
      this.id       = id;
      this.x        = Math.random() *width;
      this.y        = 0;
      this.width    = width;
      this.height   = height;
      this.gradient = gradient;
      this.speed    = 0;
      this.size     = Math.random() *2.5 +1;
      this.velocity = Math.random() *veloCoeff;
   }

   resetPosotion() {

      if(this.y >= this.height) {
         this.x = Math.random() * this.width;
         this.y = 0;
      }

      else if(this.x >= this.width) {
         this.x = 0;
         this.y = Math.random() * this.height;
      }
   }

   update() {
      
      // When reach border
      this.resetPosotion();

      // ==> Using Image color or Gradient
         this.speed = this.maxSpeed;
         // this.setSpeedAndPixelColor();
      //

      // ==> Choose movement style
         // const movement = this.setBrightFaster();
         const movement = this.setDarkFaster();
      //

      // ==> Choose rain style
         this.uniformRain(movement);
         // this.crossedRain(movement);
      //
   }

   setSpeedAndPixelColor() {

      const abs_X = Math.floor(this.x);
      const abs_Y = Math.floor(this.y);
      const { brightness, color } = this.imageMap[abs_Y][abs_X];

      this.speed      = brightness;
      this.pixelColor = color;
   }

   setBrightFaster(): number {
      // Bright faster than dark colors ==> (If using Image color not Gradient)
      return (this.maxSpeed -this.speed) +this.velocity;
   }

   setDarkFaster(): number {
      // Dark faster than bright colors ==> (If using Image color not Gradient)
      return this.speed +this.velocity;
   }

   uniformRain(movement: number) {

      // Just Y vertical   rain
      // Just X horizontal rain
      // Both X & Y, 45° angle rain

      this.x += movement *0.5;
      this.y += movement;
   }

   crossedRain(movement: number) {
      
      // Tweak values to change rain angle
      // Always max 1
      // Ex: 0.6 with 0.4
      // Ex: 0.8 with 0.2
      // Reverse values for each statment
      
      if(this.id % 2 === 0) {
         this.x += movement *0.4;
         this.y += movement *0.6;
      }

      else {
         this.x += movement *0.6;
         this.y += movement *0.4;
      }
   }

   drawImgColor(ctx: CanvasRenderingContext2D) {

      ctx.beginPath();
      ctx.fillStyle = this.pixelColor;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI *2);
      ctx.fill();
   }

   drawGradient(ctx: CanvasRenderingContext2D, hasTrail: boolean) {

      ctx.beginPath();
      // ctx.fillStyle = this.gradient;
      ctx.fillStyle = "white";

      if(!hasTrail && this.id % 2 === 0) ctx.fillStyle = "gold";

      ctx.arc(this.x, this.y, this.size, 0, Math.PI *2);
      ctx.fill();
   }
}