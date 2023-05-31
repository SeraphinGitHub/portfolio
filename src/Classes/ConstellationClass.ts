
import {
   Iposition,
} from "../interfaces";

import {
   StarClass,
   LinkClass,
   CellClass,
} from "./_export"

// =====================================================================
// Constellation Class
// =====================================================================
export class ConstellationClass {

   canvas: HTMLCanvasElement;
   img:    HTMLImageElement;
   
   width:   number;
   height:  number;
   density: number = 200;
   maxDist: number = 100;
   frame:   number = 0;
   
   starsArray: StarClass[] = [];
   cellsArray: CellClass[] = [];
   linksArray: LinkClass[] = [];

   constructor(
      canvas:  HTMLCanvasElement,
      imgPath: string,
   ) {
      this.canvas  = canvas;
      this.img     = new Image();
      this.img.src = imgPath;
      this.width   = this.canvas.width;
      this.height  = this.canvas.height;

      this.init();
   }

   init() {

      const constelSize: any = {
         width:  this.width,
         height: this.height,
         img:    this.img,
      }

      for (let i = 0; i < this.density; i++) {
         this.starsArray.push( new StarClass(constelSize) );
      }

      this.createGrid();
   }

   createGrid() {
      
      const cols: number = 5;
      const rows: number = 3;
      const cellWidth:  number = window.innerWidth  /cols;
      const cellHeight: number = window.innerHeight /rows;

      for(let i = 0; i < cols; i++) {
         for(let k = 0; k < rows; k++) {
            
            this.cellsArray.push( new CellClass(i, k, cellWidth, cellHeight, this.maxDist) );
         }
      }
   }

   handleStars(ctx: CanvasRenderingContext2D) {
         
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.frame++;

      if(this.frame % 3 === 0 ) {

         this.frame      = 0;
         this.linksArray = [];
         this.connectStars();
         // this.cellsArray.forEach(cell => cell.setStarList(this.linksArray, this.starsArray)); 
      }
         
      this.linksArray.forEach(link => link.draw(ctx));
      this.starsArray.forEach(star => star.update(ctx));
      // this.cellsArray.forEach(cell => cell.draw(ctx));
   }
   
   connectStars() {

      const starsArray:  StarClass[] = this.starsArray;
      const starsLength: number      = starsArray.length;

      for(let i = 0; i < starsLength; i++) {
         for(let k = i+1; k < starsLength; k++) {

            const { x: firstX,  y: firstY  }: Iposition = starsArray[i].position; // First  Star
            const { x: secondX, y: secondY }: Iposition = starsArray[k].position; // Second Star

            const distX:    number = firstX -secondX;
            const distY:    number = firstY -secondY;
            const starDist: number = Math.hypot(distX, distY);

            if(starDist >= this.maxDist) continue;

            const startPos: any    = { x: firstX,  y: firstY  };
            const endPos:   any    = { x: secondX, y: secondY };
            const opacity:  number = Math.floor((1 - (starDist / this.maxDist)) *10) /10;

            this.linksArray.push( new LinkClass(startPos, endPos, opacity) );
         }
      }
   }

}
