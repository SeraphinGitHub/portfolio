
import { Iposition } from "../../interfaces";

import { 
   ParticulesClass,
} from "./_export";

// =====================================================================
// Cursor Class
// =====================================================================
export class CursorClass {

   canvas:       HTMLCanvasElement;

   radius:       number  = 80;
   gravity:      number  = 30;
   isAttracting: boolean = false;
   isExploding:  boolean = false;
   
   position:   Iposition = {
      x: -this.radius,
      y: -this.radius,
   };

   constructor(
      canvas: HTMLCanvasElement,
   ) {
      this.canvas = canvas;
   }

   setMousePos(event: MouseEvent) {
      let screenBound = this.canvas.getBoundingClientRect();
   
      this.position = {
         x: Math.floor( event.clientX -screenBound.left ),
         y: Math.floor( event.clientY -screenBound.top  ),
      }
   }

   update(particule: ParticulesClass) {
      
      if(this.isColliding(particule)) {
         this.handleCollision(particule);
      }

      else particule.pixelColor = "white";
   }

   isColliding(
      particule: ParticulesClass,
   ): boolean {

      const { x, y }: Iposition = this.position;
      const { x: partX, y: partY, size: partSize } = particule;
      
      const distX:       number = partX -x;
      const distY:       number = partY -y;
      const hypotenus:   number = Math.hypot(distX, distY);
      const minDistance: number = partSize *0.5 +this.radius;

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
      particule: ParticulesClass,
   ) {
      const { x: partX,  y: partY, size: partSize } = particule;
      const { x: mouseX, y: mouseY }: Iposition = this.position;
      const gravity:  number    = this.gravity;
      const halfSize: number    = partSize *0.5;

      const max_X = this.canvas.width  -halfSize;
      const max_Y = this.canvas.height -halfSize;

      if(!this.isAttracting) {
         particule.x  +=  this.updatePosition(partX, mouseX, halfSize, max_X, gravity);
         particule.y  +=  this.updatePosition(partY, mouseY, halfSize, max_Y, gravity);
      }

      else {      
         const distX:  number = partX -mouseX;
         const distY:  number = partY -mouseY;
         const angle:  number = (Math.atan2(distY, distX) * 180) / Math.PI;
         const forceX: number = Math.cos(angle) *20;
         const forceY: number = Math.sin(angle) *20;

         particule.x += forceX;
         particule.y += forceY;

         // particule.x  -=  this.updatePosition(partX, mouseX, halfSize, max_X, gravity);
         // particule.y  -=  this.updatePosition(partY, mouseY, halfSize, max_Y, gravity);
      }

      if(this.isExploding) {
         this.isAttracting = false;
         this.isExploding  = false;
      }
      
      if(particule.x < 0) particule.x = 0;
      if(particule.y < 0) particule.y = 0;
   }
}