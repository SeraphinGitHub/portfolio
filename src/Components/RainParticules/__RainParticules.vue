
<template>
   
   <canvas ref="rainCanvas" class="Flex canvas-bgd"></canvas>
   
</template>

<script>
   import {
      ParticulesClass,
      CursorClass,
   } from "./_export";
   
   export default {

      props: {
         height:   Number,
         width:    Number,
         density:  Number,
         velocity: Number,
         size:     Number,
         hasTrail: Boolean,
         imgStr:   String,
      },

      data() {
      return {
         frame:    0,
         gradient: null,
      }},

      mounted() {
         window.addEventListener("load", () => this.initRain());
      },

      methods: {
         
         initRain() {

            const canvas  = this.$refs.rainCanvas;
            const ctx     = canvas.getContext("2d");
            canvas.height = this.height;
            canvas.width  = this.width;
            const Cursor  = new CursorClass(canvas);
            
            let pixelsMap = [];

            if(this.imgStr) {
               const picture = new Image();
               picture.src   = this.imgStr;
   
               picture.addEventListener("load", () => {
                  const imgData = this.extractImgData(ctx, picture);
   
                  // this.createGradient(ctx);
      
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
               
                  const particulesArray = this.initParticules(ctx, pixelsMap, Cursor);
                  this.animation(ctx, Cursor, particulesArray);
               });
            }

            else {
               const particulesArray = this.initParticules(ctx, pixelsMap, Cursor);
               this.animation(ctx, Cursor, particulesArray);
            }

            window.addEventListener("mousemove", (event) => Cursor.setMousePos(event));
            window.addEventListener("mousedown", (     ) => Cursor.isAttracting = true);
            window.addEventListener("mouseup",   (     ) => Cursor.isExploding  = true);
         },

         initParticules(ctx, pixelsMap, Cursor) {
            let particulesArray = [];

            for(let i = 0; i < this.density; i++) {

               const particule = new ParticulesClass(
                  pixelsMap,
                  i,
                  this.width,
                  this.height,
                  this.velocity,
                  this.size,
               );
               
               particulesArray.push(particule);
            }

            return particulesArray;
         },

         animation(ctx, Cursor, particulesArray) {
            this.frame++;

            if(this.frame % 2 === 0) {
               this.frame = 0;
               
               if(this.hasTrail) ctx.globalAlpha = 0.3;

               ctx.fillStyle = "black";
               ctx.fillRect(0, 0, this.width, this.height);

               for(let i = 0; i < particulesArray.length; i++) {
                  const particule = particulesArray[i];
   
                  particule.update();
                  ctx.globalAlpha = particule.speed;
                  Cursor.update(particule);

                  // particule.drawImageData(ctx);
                  particule.drawColor(ctx, this.hasTrail);
                  // particule.drawGradient(ctx, this.gradient)
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

         createGradient(ctx) {
            this.gradient  = ctx.createLinearGradient(0, 0, this.width, this.height);
            this.skyGradient();
         },

         violetGradient() {
            this.gradient.addColorStop(0,   "black");
            this.gradient.addColorStop(0.5, "darkviolet");
            this.gradient.addColorStop(1,   "gold");
         },

         blueGradient() {
            this.gradient.addColorStop(0,   "black");
            this.gradient.addColorStop(0.5, "dodgerblue");
            this.gradient.addColorStop(1,   "lime");
         },
         
         skyGradient() {
            this.gradient.addColorStop(0.1, "black");
            this.gradient.addColorStop(0.2, "dimgray");
            this.gradient.addColorStop(0.3, "dimgray");
            this.gradient.addColorStop(0.4, "dodgerblue");
            this.gradient.addColorStop(0.5, "dodgerblue");
            this.gradient.addColorStop(0.6, "lightblue");
            this.gradient.addColorStop(0.7, "lightblue");
            this.gradient.addColorStop(0.8, "dodgerblue");
            this.gradient.addColorStop(0.9, "dimgray");
            this.gradient.addColorStop(1,   "black");
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
