
import {
   Iposition,
} from "../../interfaces";

import {
   StarClass,
} from "./_export"

// =====================================================================
// Constellation Class
// =====================================================================
export class ConstellationClass {

   canvas: HTMLCanvasElement;
   img:    HTMLImageElement;
   
   emptyWidth: number = 0.4; // 40% screen size

   width:       number;
   height:      number;
   leftBorder:  number ;
   density:     number;
   starRange:   number;
   starSize:    number;
   linkMaxDist: number;
   frame:       number = 0;
   
   starsArray: StarClass[] = [];
   linksArray: unknown[]   = [];

   constructor(
      canvas:    HTMLCanvasElement,
      imgPath:   string,
      density:   number,
      starRange: number,
      starSize:  number,
      linkDist:  number,
   ) {
      this.canvas     = canvas;
      this.img        = new Image();
      this.img.src    = imgPath;
      this.density    = density;
      this.starRange  = starRange;
      this.starSize   = starSize;
      this.linkMaxDist= linkDist;
      this.width      = this.canvas.width;
      this.height     = this.canvas.height;
      this.leftBorder = this.width *this.emptyWidth;

      this.init();
   }

   init() {

      const constellation: any = {
         width:      this.width,
         height:     this.height,
         emptyWidth: this.emptyWidth,
         leftBorder: this.leftBorder,
         starRange:  this.starRange,
         starSize:   this.starSize,
         img:        this.img,
      }

      for (let i = 0; i < this.density; i++) {
         this.starsArray.push( new StarClass(i, constellation) );
      }
   }

   resize(
      ctx:   CanvasRenderingContext2D,
      event: any,
   ) {

      const eventWidth  = event.target.window.innerWidth;
      const eventHeight = event.target.window.innerHeight;

      this.width         = eventWidth;
      this.height        = eventHeight;
      this.canvas.width  = eventWidth;
      this.canvas.height = eventHeight;

      ctx.strokeStyle = "white";
      ctx.lineWidth   = 2;

      this.starsArray.forEach((star) => star.reset(eventWidth, eventHeight));
   }

   getCellID(position: Iposition) {

      const cellX = Math.floor(position.x /this.linkMaxDist);
      const cellY = Math.floor(position.y /this.linkMaxDist);

      return {
         cellX,
         cellY,
      };
   }

   getNeighborCells(position: Iposition) {

      const { cellX, cellY } = this.getCellID(position);

      return [
         `${cellX   }-${cellY   }`, // current cell
         `${cellX -1}-${cellY -1}`, // top-left
         `${cellX   }-${cellY -1}`, // top
         `${cellX +1}-${cellY -1}`, // top-right
         `${cellX +1}-${cellY   }`, // right
         `${cellX +1}-${cellY +1}`, // bottom-right
         `${cellX   }-${cellY +1}`, // bottom
         `${cellX -1}-${cellY +1}`, // bottom-left
         `${cellX -1}-${cellY   }`, // left
      ];
   }

   starsConnect_OLD() {

      const maxDist:     number      = this.linkMaxDist;
      const starsArray:  StarClass[] = this.starsArray;
      const starsLength: number      = starsArray.length;

      for(let i = 0; i < starsLength -1; i++) {
         
         // Create link every 3 stars
         if(i % 3 !== 0) continue;
         
         for(let k = i+1; k < starsLength; k++) {

            const { x: firstX,  y: firstY  }: Iposition = starsArray[i].position; // First  Star
            const { x: secondX, y: secondY }: Iposition = starsArray[k].position; // Second Star

            const distX:    number = firstX -secondX;
            const distY:    number = firstY -secondY;
            const starDist: number = Math.hypot(distX, distY);

            if(starDist >= maxDist) continue;

            const startPos: Iposition = { x: firstX,  y: firstY  };
            const endPos:   Iposition = { x: secondX, y: secondY };
            const opacity:  number    = Math.floor((1 - (starDist / maxDist)) *10) /10;

            const linkData = {
               id: `${i}-${k}`,
               startPos,
               endPos,
               opacity,
            };

            this.linksArray.push(linkData);
         }
      }
   }

   starsConnect() {

      const gridMap = new Map<string, StarClass[]>();
   
      // Add each stars within the same cell to the grid
      this.starsArray.forEach((star) => {
         const { cellX, cellY } = this.getCellID(star.position);
         const cellID = `${cellX}-${cellY}`;

         if(!gridMap.has(cellID)) gridMap.set(cellID, []);
         gridMap.get(cellID)!.push(star);
      });


      // Check distances between stars within same neighboring
      // Set neighbors
      this.starsArray.forEach((star) => {
         const neighborsArrayID: string[] = this.getNeighborCells(star.position);
   
         // Create link every 3 stars
         if(star.id % 3 !== 0) return;

         // Get neighbor's cells
         neighborsArrayID.forEach((cellID) => {
            const neighborCells: StarClass[] | undefined = gridMap.get(cellID);

            if(!neighborCells) return;
            
            // Get cell's stars
            neighborCells.forEach((nebStar) => {

               if(nebStar === star) return;

               // Set star distance
               const distX:    number = star.position.x -nebStar.position.x;
               const distY:    number = star.position.y -nebStar.position.y;
               const starDist: number = Math.hypot(distX, distY);

               if(starDist >= this.linkMaxDist) return;

               // Set link data
               const startPos: Iposition = { x: star.position.x,    y: star.position.y    };
               const endPos:   Iposition = { x: nebStar.position.x, y: nebStar.position.y };
               const opacity:  number    = Math.floor((1 - (starDist /this.linkMaxDist)) * 10) / 10;

               const linkData = {
                  id: `${star.id}-${nebStar.id}`,
                  startPos,
                  endPos,
                  opacity,
               };

               this.linksArray.push(linkData);
            });
         });
      });
   }

   starsReconnect() {

      const starsArray:  StarClass[] = this.starsArray;

      this.linksArray.forEach((link: any) => {
         const splitedID: number[] = link.id.split("-");
         const i: number = splitedID[0];
         const k: number = splitedID[1];

         link.startPos = starsArray[i].position; // First  Star
         link.endPos   = starsArray[k].position; // Second Star
      });
   }

   update(ctx: CanvasRenderingContext2D) {

      this.frame++;
      
      // Connect stars every 7 frames
      if(this.frame % 7 === 0) {
         this.frame      = 0;
         this.linksArray = [];
         this.starsConnect();
      }
      
      // Reconnect stars every 3 frames
      else if(this.frame % 3 === 0) {
         this.starsReconnect();
      }
         
      
      // this.starsArray.forEach(star => this.drawFrame(star));
      this.linksArray.forEach(link => this.drawLink(ctx, link));
      this.starsArray.forEach(star => star.update(ctx));
   }

   drawLink(
      ctx:  CanvasRenderingContext2D,
      link: any,
   ) {

      const { startPos, endPos, opacity }: any  = link;
      const { x: startX, y: startY }: Iposition = startPos;
      const { x: endX,   y: endY   }: Iposition = endPos;

      ctx.save();
      ctx.globalAlpha = opacity;

      ctx.beginPath();
      ctx.moveTo( startX, startY );
      ctx.lineTo( endX,   endY   );
      ctx.stroke();

      ctx.restore();
   }
   
   drawFrame(
      ctx:  CanvasRenderingContext2D,
      cell: StarClass,
   ) {

      ctx.save();
      ctx.lineWidth = 1;
      
      if(cell.id % 1 === 0) ctx.strokeStyle = "black";
      if(cell.id % 2 === 0) ctx.strokeStyle = "lime";
      if(cell.id % 3 === 0) ctx.strokeStyle = "red";
      
      
      ctx.strokeRect(
         cell.position.x,
         cell.position.y,
         this.linkMaxDist,
         this.linkMaxDist
      );

      ctx.restore();
   }

}
