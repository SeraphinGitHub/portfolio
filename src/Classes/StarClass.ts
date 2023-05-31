
import {
   INumber,
   Iposition,
} from "../interfaces";

// =====================================================================
// Star Class
// =====================================================================
export class StarClass {

   constellation: any;
   leftBorder: number;
   
   position:   Iposition = { x: 0, y: 0 };
   velocity:   Iposition = { x: 0, y: 0 };
   
   veloSpecs:  INumber = {
      range:  1.5,
      margin: 0.4,
   }

   size:     number = this.randValue(10, 30);
   halfSize: number = this.size *0.5;
   imgSize:  number = 53; // 53 x 53 px

   constructor(constellationSize: any) {
      this.constellation = constellationSize;

      this.leftBorder    = this.constellation.width *0.4;
      // this.leftBorder    = this.halfSize;

      this.position = {
         x: this.randValue(this.leftBorder, this.constellation.width  -this.size),
         y: this.randValue(this.halfSize,   this.constellation.height -this.size),
      };

      this.velocity = {
         x: this.randVelocity(),
         y: this.randVelocity(),
      };
   }
   
   randValue(
      base:    number,
      range:   number,
   ): number {

      return Math.floor( (Math.random() * range + base) *10 ) /10;
   }

   randVelocity() {

      const { range, margin }: INumber = this.veloSpecs;
      const base: number = -range *0.5;

      let value: number = this.randValue(base, range);

      while(Math.abs(value) < margin) {
         value = this.randValue(base, range);
      }
      return value;
   }

   drawImage(ctx: CanvasRenderingContext2D) {

      const { x, y }: Iposition = this.position;
      const imgSize:  number    = this.imgSize;
      const halfSize: number    = this.halfSize;
      const size:     number    = this.size;

      ctx.drawImage(this.constellation.img,
         0, 0, imgSize, imgSize,

         x -halfSize,
         y -halfSize,
         size,
         size
      );
   }

   drawText(ctx: CanvasRenderingContext2D) {

      const halfSize: number    = this.halfSize;

      const { x, y }: Iposition = this.position;
      const text: string = `${ Math.floor(x) }-${ Math.floor(y) }`;

      // const { x, y }: Iposition = this.velocity;
      // const text: string = `${ x }-${ y }`;

      ctx.save();
      ctx.fillStyle = "lime";
      ctx.fillText(text, x -halfSize, y -halfSize);
      ctx.restore();
   }

   drawSquare(ctx: CanvasRenderingContext2D) {
      
      const { x, y }: Iposition = this.position;

      ctx.save();
      ctx.fillStyle = "dodgerblue";
      ctx.fillRect(
         x -this.halfSize,
         y -this.halfSize,
         this.size,
         this.size
      );
      ctx.restore();
   }

   update(ctx: CanvasRenderingContext2D) {

      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      // Bounce X axis on collide bounderies
      if(this.position.x > this.constellation.width  -this.halfSize
      || this.position.x < this.leftBorder) {

         this.velocity.x *= -1;
      }

      // Bounce Y axis on collide bounderies
      if(this.position.y > this.constellation.height -this.halfSize
      || this.position.y < this.halfSize) {

         this.velocity.y *= -1;
      }

      this.drawImage(ctx);
      // this.drawText(ctx);
   }

}