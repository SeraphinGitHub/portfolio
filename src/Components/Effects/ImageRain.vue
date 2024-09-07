
<template>
   
   <canvas ref="rainCanvas" class="Flex canvas-bgd"></canvas>
   
</template>

<script>
   import {
      ParticulesClass,
      CursorClass,
   } from "../../Scripts/ImageRain/_export";
   
   import { imgStr } from "../../Scripts/ImageRain/imgTo64_Barrack_Lighten"

   export default {

      props: {
         hasTrail: Boolean,
         density:  Number,
         speed:    Number,
      },

      data() {
      return {
         frame:  0,
         height: 100,
         width:  100,
      }},

      mounted() {
         const picture = new Image();
         picture.src   = imgStr;
         picture.addEventListener("load", () => this.init(picture));
      },

      methods: {
         
         init(picture) {
            
            const canvas  = this.$refs.rainCanvas;
            const ctx     = canvas.getContext("2d");
            this.width    = window.innerWidth;
            this.height   = window.innerHeight;
            canvas.height = this.height;
            canvas.width  = this.width;
            const Cursor  = new CursorClass(canvas);
            const imgData = this.extractImgData(ctx, picture);

            const gradient = ctx.createLinearGradient(0, 0, this.width, this.height);
            this.skyGradient(gradient);

            let particulesArray = [];
            let pixelsMap       = [];

            for(let y = 0; y < this.height; y++) {
               let row = [];

               for(let x = 0; x < this.width; x++) {
                  const red   = imgData[ this.findIndex(x, y, 0) ];
                  const green = imgData[ this.findIndex(x, y, 1) ];
                  const blue  = imgData[ this.findIndex(x, y, 2) ];
                  
                  row.push({
                     brightness: this.calcBrightness(red, green, blue),
                     color:      `rgb(${red}, ${green}, ${blue})`,
                  });
               }

               pixelsMap.push(row);
            }
            
            for(let i = 0; i < this.density; i++) {
               particulesArray.push( new ParticulesClass(pixelsMap, i, this.width, this.height, gradient, this.speed) );
            }

            window.addEventListener("mousemove", (event) => Cursor.setMousePos(event));
            window.addEventListener("mousedown", (     ) => Cursor.isAttracting = true);
            window.addEventListener("mouseup",   (     ) => Cursor.isExploding  = true);

            this.animation(ctx, Cursor, particulesArray);
         },

         animation(ctx, Cursor, particulesArray) {
            this.frame++;

            if(this.frame % 2 === 0) {
               this.frame = 0;
               
               if(this.hasTrail) ctx.globalAlpha = 0.5;

               ctx.fillStyle = "black";
               ctx.fillRect(0, 0, this.width, this.height);

               for(let i = 0; i < particulesArray.length; i++) {
                  const particule = particulesArray[i];
   
                  particule.update();
                  ctx.globalAlpha = particule.speed *0.4;
                  Cursor.update(particule);

                  // particule.drawImgColor(ctx);
                  particule.drawGradient(ctx, this.hasTrail);
               }
            };
            
            requestAnimationFrame(() => this.animation(ctx, Cursor, particulesArray));
         },

         findIndex(x, y, modifier) {
            return (y *4 *this.width) + (x *4 +modifier);
         },

         calcBrightness(red, green, blue) {
            return Math.floor(
               Math.sqrt(
                  red   *red   *0.299 +
                  green *green *0.587 +
                  blue  *blue  *0.114
               ) /10
            ) /10;
         },

         extractImgData(ctx, picture) {

            // Draw picture
            ctx.drawImage(picture, 0, 0, this.width, this.height);

            // Extract picture pixels infos
            const { data } = ctx.getImageData(0, 0, this.width, this.height);
            
            // Clear canvas
            ctx.clearRect(0, 0, this.width, this.height);

            return data;
         },

         violetGradient(gradient) {
            gradient.addColorStop(0,   "black");
            gradient.addColorStop(0.5, "darkviolet");
            gradient.addColorStop(1,   "gold");
         },

         blueGradient(gradient) {
            gradient.addColorStop(0,   "black");
            gradient.addColorStop(0.5, "dodgerblue");
            gradient.addColorStop(1,   "lime");
         },
         
         skyGradient(gradient) {
            gradient.addColorStop(0.1, "black");
            gradient.addColorStop(0.2, "dimgray");
            gradient.addColorStop(0.3, "dimgray");
            gradient.addColorStop(0.4, "dodgerblue");
            gradient.addColorStop(0.5, "dodgerblue");
            gradient.addColorStop(0.6, "lightblue");
            gradient.addColorStop(0.7, "lightblue");
            gradient.addColorStop(0.8, "dodgerblue");
            gradient.addColorStop(0.9, "dimgray");
            gradient.addColorStop(1,   "black");
         },
      }
   }
</script>

<style scoped>
   
   /* .canvas-bgd {
      background: black;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      ========================================
      height: 800px;    <== Has to match script canvas size
      width:  500px;
      ========================================
   } */

</style>
