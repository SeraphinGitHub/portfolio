
import { Iposition } from "../interfaces";

import {
   StarClass,
   LinkClass,
} from "./_export";

// =====================================================================
// CellClass
// =====================================================================
export class CellClass {

   i:       number;
   k:       number;
   width:   number;
   height:  number;
   maxDist: number;

   position:   Iposition   = { x: 0, y: 0 };
   starsList:  StarClass[] = [];

   constructor(
      i:       number,
      k:       number,
      width:   number,
      height:  number,
      maxDist: number,
   ) {
      this.i        = i;
      this.k        = k;
      this.width    = width;
      this.height   = height;
      this.maxDist  = maxDist;

      this.position = {
         x: this.width  *this.i,
         y: this.height *this.k,
      };
   }

   draw(ctx: CanvasRenderingContext2D) {

      ctx.strokeRect(
         this.width  *this.i,
         this.height *this.k,
         this.width,
         this.height
      );
   }

   withinCell(
      star: StarClass,
   ): boolean {

      const { x, y }: Iposition = this.position;
      const {
         x: starX,
         y: starY,
      }: Iposition = star.position;

      const isOverLaping: boolean =
         !(x > starX
         ||y > starY
         ||x +this.width  < starX
         ||y +this.height < starY)
      ;
      
      if(isOverLaping) return true;
      return false;
   }

   setStarList(
      linksArray: LinkClass[],
      starsArray: StarClass[],
   ) {
      this.starsList = [];

      starsArray.forEach(star => {

         if(this.withinCell(star)) {
            this.starsList.push(star);
            this.connectStars(linksArray);
         }
      });
   }

   connectStars(
      linksArray: LinkClass[],
   ) {
      const starsList:  StarClass[] = this.starsList;
      const starsLength: number     = starsList.length;

      for(let i = 0; i < starsLength; i++) {
         for(let k = i+1; k < starsLength; k++) {

            const { x: firstX,  y: firstY  }: Iposition = starsList[i].position; // First  Star
            const { x: secondX, y: secondY }: Iposition = starsList[k].position; // Second Star

            const distX:    number = firstX -secondX;
            const distY:    number = firstY -secondY;
            const starDist: number = Math.hypot(distX, distY);

            if(starDist >= this.maxDist) continue;

            const startPos: any    = { x: firstX,  y: firstY  };
            const endPos:   any    = { x: secondX, y: secondY };
            const opacity:  number = Math.floor((1 - (starDist / this.maxDist)) *10) /10;

            linksArray.push( new LinkClass(startPos, endPos, opacity) );
         }
      }
   }
}