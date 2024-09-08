
import {
   INumber,
   Iposition,
} from "../../interfaces";

// =====================================================================
// Star Class
// =====================================================================
export class StarClass {

   id:          number;
   constell:    any;
   
   position:    Iposition = { x: 0, y: 0 };
   velocity:    Iposition = { x: 0, y: 0 };
   oldPosition: Iposition = { x: 0, y: 0 };
   oldVelocity: Iposition = { x: 0, y: 0 };
   
   imgSize:     number    = 53; // Image ==> 53 x 53 px
   friction:    number    = 0.02;
   size:        number;
   halfSize:    number;

   isPosSaved:  boolean = false;
   hasExplode:  boolean = false;
   
   veloSpecs:   INumber   = {
      range:  1.5,
      margin: 0.5,
   }

   constructor(
      id:            number,
      constellation: any,
   ) {
      this.id       = id;
      this.constell = constellation;
      this.size     = this.randValue(constellation.starSize, constellation.starRange);
      this.halfSize = this.size *0.5;

      this.position = {
         x: this.randValue(this.constell.leftBorder, this.constell.width  -this.size),
         y: this.randValue(this.halfSize,            this.constell.height -this.size),
      };

      this.velocity = {
         x: this.randVelocity(),
         y: this.randVelocity(),
      };
   }

   reset(
      eventWidth:  number,
      eventHeight: number,
   ) {
      this.constell.width      = eventWidth;
      this.constell.height     = eventHeight;
      this.constell.leftBorder = eventWidth *this.constell.emptyWidth;
      
      this.position.x = this.constell.leftBorder + Math.random() * (eventWidth  -this.size);
      this.position.y = this.size                + Math.random() * (eventHeight -this.size);
   }
   
   randValue(
      base:    number,
      range:   number,
   ): number {

      return Math.floor( (Math.random() *range +base) *10) /10;
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

      ctx.drawImage(this.constell.img,
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

   savePosition() {

      if(this.isPosSaved) return;

      this.oldPosition = {
         x: this.position.x,
         y: this.position.y,
      };
      
      this.isPosSaved = true;
   }

   updateVelocity(
      current: number,
      old:     number,
   ): number {

      return Math.floor( (current +(current < old ?this.friction :-this.friction)) * 100) /100;
   }

   handleExplode() {

      if(!this.hasExplode) return;

      const friction: number = this.friction;
      const { x: curVelo_X, y: curVelo_Y }: Iposition = this.velocity;
      const { x: oldVelo_X, y: oldVelo_Y }: Iposition = this.oldVelocity;
         
      this.velocity.x = this.updateVelocity(curVelo_X, oldVelo_X);
      this.velocity.y = this.updateVelocity(curVelo_Y, oldVelo_Y);

      const isRange_X: boolean = (curVelo_X -friction < oldVelo_X) && (oldVelo_X < curVelo_X +friction);
      const isRange_Y: boolean = (curVelo_Y -friction < oldVelo_Y) && (oldVelo_Y < curVelo_Y +friction);

      if(isRange_X && isRange_Y) this.hasExplode = false;
   }

   update(ctx: CanvasRenderingContext2D) {
      
      this.handleExplode();

      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      // Bounce X axis on collide bounderies
      if(this.position.x > this.constell.width -this.halfSize
      || this.position.x < this.constell.leftBorder) {

         this.velocity.x *= -1;
      }

      // Bounce Y axis on collide bounderies
      if(this.position.y > this.constell.height -this.halfSize
      || this.position.y < this.halfSize) {

         this.velocity.y *= -1;
      }

      this.drawImage(ctx);
      // this.drawText(ctx);
   }

}