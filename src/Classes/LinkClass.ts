
import { Iposition } from "../interfaces";

// =====================================================================
// Link Class
// =====================================================================
export class LinkClass {
   
   startPos: Iposition = { x: 0, y: 0 };
   endPos:   Iposition = { x: 0, y: 0 };
   opacity:  number;

   constructor(
      startPos: Iposition,
      endPos:   Iposition,
      opacity:  number,
   ) {
      this.startPos = startPos;
      this.endPos   = endPos;
      this.opacity  = opacity;
   }
   
   draw(ctx: CanvasRenderingContext2D) {

      const { x: startX, y: startY }: Iposition = this.startPos;
      const { x: endX,   y: endY   }: Iposition = this.endPos;

      ctx.save();
      ctx.globalAlpha = this.opacity;

      ctx.beginPath();
      ctx.moveTo( startX, startY );
      ctx.lineTo( endX,   endY   );
      ctx.stroke();

      ctx.restore();
   }
}