
<template>

   <canvas ref="constellationCanvas" class="Flex canvas-bgd"></canvas>

</template>

<script lang="ts">
   import {
      ConstellationClass,
      CursorClass,
   } from "../Classes/_export";

   export default {
      data() {
         return {
            imgPath:      "/images/star.png"   as string,
            ctx:           undefined           as CanvasRenderingContext2D | undefined,
            Constellation: undefined           as ConstellationClass       | undefined,
            Cursor:        undefined           as CursorClass              | undefined,
         }
      },

      methods: {
         init() {
            const canvas = this.$refs.constellationCanvas as HTMLCanvasElement;

            canvas.height = window.innerHeight;
            canvas.width  = window.innerWidth;
            
            this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
            this.ctx.strokeStyle = "white";
            this.ctx.lineWidth   = 2;

            this.Constellation = new ConstellationClass(canvas, this.ctx, this.imgPath) as ConstellationClass;
            this.Cursor        = new CursorClass       (canvas, this.Constellation)     as CursorClass;
            
            window.addEventListener("resize",    (event) => this.Constellation!.resize(event));
            window.addEventListener("mousemove", (event) => this.Cursor!.setMousePos(event));
            window.addEventListener("mousedown", (     ) => this.Cursor!.isAttracting = true);
            window.addEventListener("mouseup",   (     ) => this.Cursor!.isExploding  = true);
            
            this.animation();
         },

         animation() {
            this.Cursor!.update();
            this.Constellation!.update();
            requestAnimationFrame(this.animation);
         },
      },

      mounted() {
         this.init();
      },
   }
</script>

<style scoped>

   .canvas-bgd {
      /* background: black; */
      position: fixed;
      top: 0;
      right: 0;
      height: 100%;
      width: 100%;
      object-fit: contain;
   }

</style>
