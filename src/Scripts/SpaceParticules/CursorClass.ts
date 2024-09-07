
import { Iposition } from "../../interfaces";

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

   radius:       number      = 130;
   rimSpeed:     number      = 0.8;
   repulseSpeed: number      = 4;
   attractSpeed: number      = -8;
   explodeSpeed: number      = 15;
   isAttracting: boolean     = false;
   isExploding:  boolean     = false;
   starsList:    StarClass[] = [];
   explodedList: StarClass[] = [];

   position:     Iposition   = {
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

   setMousePos(event: MouseEvent) {
      let screenBound = this.canvas.getBoundingClientRect();
   
      this.position = {
         x: Math.floor( event.clientX -screenBound.left ),
         y: Math.floor( event.clientY -screenBound.top  ),
      }
   }

   update() {

      this.starsList.forEach(star => {
         if     (this.isColliding(star, this.radius   )) this.handleCollision(star, true );
         else if(this.isColliding(star, this.radius +5)) this.handleCollision(star, false);
      });

      if(this.isExploding) {
         const hasAllStarExploded = this.explodedList.every(start => start.hasExplode === true);

         if(hasAllStarExploded) {
            this.isExploding  = false;
            this.explodedList = [];
         }
      }
   }

   isColliding(
      star:   StarClass,
      radius: number,
   ): boolean {

      const { x, y }: Iposition = this.position;
      const {
         x: starX,
         y: starY,
      }: Iposition = star.position;
      
      const distX:       number = starX -x;
      const distY:       number = starY -y;
      const hypotenus:   number = Math.hypot(distX, distY);
      const minDistance: number = star.halfSize +radius;

      if(hypotenus <= minDistance) return true;
      return false;
   }

   updatePosition(
      position:  number,
      coord:     number,
      minBound:  number,
      maxBound:  number,
      pushSpeed: number,
   ): number {

      if (position > coord && position < maxBound) return  pushSpeed;
      if (position < coord && position > minBound) return -pushSpeed;
      
      return 0;
   }

   handleCollision(
      star:         StarClass,
      isSmallRange: boolean
   ) {

      const { x: starX,  y: starY  }: Iposition = star.position;
      const { x: mouseX, y: mouseY }: Iposition = this.position;

      const min_X = star.constell.leftBorder;
      const min_Y = star.halfSize;
      const max_X = this.canvas.width  -star.halfSize;
      const max_Y = this.canvas.height -star.halfSize;
      
      // Repulse stars on mouseMove
      if(!this.isAttracting) {
         let pushSpeed: number = this.repulseSpeed;
         
         if(!isSmallRange) pushSpeed = this.rimSpeed;

         star.position.x += this.updatePosition(starX, mouseX, min_X, max_X, pushSpeed);
         star.position.y += this.updatePosition(starY, mouseY, min_Y, max_Y, pushSpeed);
      }

      // Attrack stars on mouseDown
      else {
         star.savePosition();
         star.position.x += this.updatePosition(starX, mouseX, min_X, max_X, this.attractSpeed);
         star.position.y += this.updatePosition(starY, mouseY, min_Y, max_Y, this.attractSpeed);

         if(mouseX < min_X) star.position.x -= this.attractSpeed;
      }

      // Explode stars on mouseUp
      if(this.isExploding) {

         star.oldVelocity = {
            x: star.velocity.x,
            y: star.velocity.y,
         };
         
         star.hasExplode   = true;
         star.isPosSaved   = false;
         this.isAttracting = false;

         const { x: oldStarX, y: oldStarY }: Iposition = star.oldPosition;

         const distX:  number = oldStarX -mouseX;
         const distY:  number = oldStarY -mouseY;

         const angle:  number = (Math.atan2(distY, distX) * 180) / Math.PI;

         const forceX: number = Math.cos(angle) *this.explodeSpeed;
         const forceY: number = Math.sin(angle) *this.explodeSpeed;

         star.velocity.x = forceX;
         star.velocity.y = forceY;
         
         this.explodedList.push(star);
      }
   }
}