
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
            imgPath:       "./images/star.png" as string,
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

            this.Constellation = new ConstellationClass(canvas, this.imgPath) as ConstellationClass;
            this.Cursor        = new CursorClass (canvas, this.Constellation) as CursorClass;
            
            window.addEventListener("mousemove", (event) => this.Cursor!.detect(event));
            // window.addEventListener("mousedown", (event) => this.Cursor!.detect(event));
            // window.addEventListener("mouseup",   (event) => this.Cursor!.detect(event));
            
            this.animation();
         },

         animation() {
            this.Cursor!.interact();
            this.Constellation!.handleStars(this.ctx!);
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
      left: 0;
      height: 100%;
      width: 100%;
      object-fit: contain;
   }

</style>
