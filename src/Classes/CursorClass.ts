
import { Iposition } from "../interfaces";

import { 
   ConstellationClass,
   StarClass,
} from "./_export";

// =====================================================================
// Cursor Class
// =====================================================================
export class CursorClass {

   canvas:        HTMLCanvasElement;
   Constellation: ConstellationClass;

   radius:        number      = 140;
   gravity:       number      = -3;
   isPressed:     boolean     = false;
   starsList:     StarClass[] = [];

   position:   Iposition = {
      x: -this.radius,
      y: -this.radius,
   };

   constructor(
      canvas:        HTMLCanvasElement,
      Constellation: ConstellationClass,
   ) {
      this.canvas        = canvas;
      this.Constellation = Constellation;

      this.init();
   }

   init() {
      this.starsList = this.Constellation.starsArray;
   }

   detect(event: MouseEvent) {

      this.isPressed = !this.isPressed;
      this.position  = this.getMousePos(event);
   }

   interact() {
      // if(!this.isPressed) return;

      this.starsList.forEach(star => {
         if(this.checkCollision(star)) this.handleCollision(star);
      });
   }

   getMousePos(event: MouseEvent) {
      let screenBound = this.canvas.getBoundingClientRect();
   
      return {
         x: Math.floor( event.clientX -screenBound.left ),
         y: Math.floor( event.clientY -screenBound.top  ),
      }
   }

   checkCollision(
      star: StarClass,
   ): boolean {

      const { x, y }: Iposition = this.position;
      const {
         x: starX,
         y: starY,
      }: Iposition = star.position;
      
      const distX:       number = starX -x;
      const distY:       number = starY -y;
      const hypotenus:   number = Math.hypot(distX, distY);
      const minDistance: number = star.halfSize +this.radius;

      if(hypotenus <= minDistance) return true;
      return false;
   }

   handleCollision(
      star: StarClass,
   ) {

      const { x: starX, y: starY }: Iposition = star.position;
      const { x, y }: Iposition = this.position;
      const gravity:  number    = this.gravity;

      if(starX > x && starX < this.canvas.width  -star.halfSize) star.position.x -= gravity;
      if(starY > y && starY < this.canvas.height -star.halfSize) star.position.y -= gravity;
      if(starX < x && starX > star.leftBorder)                   star.position.x += gravity;
      if(starY < y && starY > star.halfSize)                     star.position.y += gravity;

      // if(starX > x) star.velocity.x = -gravity;
      // if(starX < x) star.velocity.x =  gravity;
      // if(starY > y) star.velocity.y = -gravity;
      // if(starY < y) star.velocity.y =  gravity;
   }
}