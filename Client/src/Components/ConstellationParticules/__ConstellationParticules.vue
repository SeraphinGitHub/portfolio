
<template>

   <canvas ref="constellationCanvas" class="Flex canvas-bgd"></canvas>

</template>

<script lang="ts">
   import {
      ConstellationClass,
      CursorClass,
   } from "./_export";

   export default {

      props: {
         density:   Number,
         starRange: Number,
         starSize:  Number,
         linkDist:  Number,
         socket:    Object,
      },

      data() {
      return {
         height: window.innerHeight,
         width:  window.innerWidth,
         imgPath:      "/images/star.png"   as string,
         Constellation: undefined           as ConstellationClass | undefined,
         Cursor:        undefined           as CursorClass        | undefined,
      }},

      mounted() {
         window.addEventListener("load", () => this.init());
      },

      methods: {

         init() {
         
            const canvas  = this.$refs.constellationCanvas as HTMLCanvasElement;
            const ctx     = canvas.getContext("2d")        as CanvasRenderingContext2D;
            canvas.height = this.height;
            canvas.width  = this.width;

            ctx.strokeStyle = "white";
            ctx.lineWidth   = 2;


            // Init Constellaion Class
            this.Constellation = new ConstellationClass(
               canvas,
               this.imgPath,
               this.density!,
               this.starRange!,
               this.starSize!,
               this.linkDist!,
            ) as ConstellationClass;


            // Init Cursor Class
            this.Cursor = new CursorClass(
               canvas,
               this.Constellation,
            ) as CursorClass;

            
            this.animation(ctx);
            
            window.addEventListener("resize",    (event) => this.Constellation!.resize(ctx, event));
            window.addEventListener("mousemove", (event) => this.Cursor!.setMousePos(event));
            window.addEventListener("mousedown", (     ) => this.Cursor!.attract());
            window.addEventListener("mouseup",   (     ) => this.Cursor!.explode(this.socket));
         },

         animation(ctx: CanvasRenderingContext2D) {
            
            ctx!.clearRect(0, 0, this.width, this.height);
            this.Cursor!.update();
            this.Constellation!.update(ctx);

            requestAnimationFrame(() => this.animation(ctx));
         },
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
