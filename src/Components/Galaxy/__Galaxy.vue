
<template>
   <section class="flex">

      <div class="spinal-black-ring">
         <div class="back"/>
      </div>
      
      <div class="spinal-galaxy">
         <div class="bot"/>

         <Spin :style="varSpinBot"/>
         <Spin :style="varSpinMid1"/>
         <Spin :style="varSpinMid2"/>
         <Spin :style="varSpinTop"/>

         <div class="top"/>
      </div>

   </section>
</template>

<script>
   import Spin from "./Spin.vue"

   export default {

      components: {
         Spin,
      },

      computed: {
         varSpinTop() {
         return {
            // "--noseColor": "crimson",
            // "--tailColor": "darkred",
            "--noseColor": "yellow",
            "--tailColor": "gold",
            "--size" :      300 +"px",
            "--top":        30 +"%",
            "--left":       50 +"%",
            "--startAngle": 0  +"deg",
            "--endAngle"  : 360 +"deg",
            "--anim":       5 +"s",
         }},

         varSpinMid1() {
         return {
            "--noseColor": "darkviolet",
            "--tailColor": "darkmagenta",
            "--size" :      800 +"px",
            "--top":        50 +"%",
            "--left":       50 +"%",
            "--startAngle": 0   +"deg",
            "--endAngle"  : 360 +"deg",
            "--anim":       12 +"s",
         }},

         varSpinMid2() {
         return {
            "--noseColor": "darkviolet",
            "--tailColor": "darkmagenta",
            "--size":       800 +"px",
            "--top":        50 +"%",
            "--left":       50 +"%",
            "--startAngle": 90  +"deg",
            "--endAngle"  : 450 +"deg",
            "--anim":       12 +"s",
         }},

         varSpinBot() {
         return {
            "--noseColor": "dodgerblue",
            "--tailColor": "dodgerblue",
            "--size" :      400 +"px",
            "--top":        70 +"%",
            "--left":       50 +"%",
            "--startAngle": 90  +"deg",
            "--endAngle"  : 450 +"deg",
            "--anim":       8 +"s",
         }},
      },
   }
</script>

<style scoped lang="scss">
   
   $WiggleAnim: 15s;

   .spinal-black-ring {
      z-index: 5;
      position: fixed;
      top: 50%;
      left: 70%;
      height: 100px;
      width: 100px;
      transform: translate(-50%, -50%) rotate(-30deg);
      animation: BlackRing_wiggle $WiggleAnim ease-in-out infinite;

      .back {
         z-index: 9;
         position: absolute;
         top: 50%;
         left: 50%;
         height: 1600px;
         width: 1600px;
         border-radius: 50%;
         transform: translate(-50%, -50%) rotateX(-72deg);
         background: radial-gradient(circle at center,
            transparent,
            black,
            transparent,
            transparent,
            transparent
         );
      }
   }
   
   .spinal-galaxy {
      z-index: 15;
      position: fixed;
      top: 50%;
      left: 70%;
      height: 100px;
      width: 100px;
      transform: translate(-50%, -50%) rotate(-30deg);
      animation: Galaxy_wiggle $WiggleAnim ease-in-out infinite;

      .top {
         position: absolute;
         top: -4%;
         height: 51px;
         width: 100px;
         border-radius: 50px 50px 0 0;
         background-color: black;
      }

      .bot {
         position: absolute;
         top: 46%;
         height: 52px;
         width: 100px;
         border-radius: 0 0 50px 50px;
         background-color: black;
      }
   }

   @keyframes Galaxy_wiggle {

      0%   { top: 56%; left: 72%;  }
      50%  { top: 44%; left: 68%;  }
      100% { top: 56%; left: 72%;  }

      0%   { transform: translate(-50%, -50%) rotate(-36deg) }
      25%  { transform: translate(-50%, -50%) rotate(-27deg) }
      50%  { transform: translate(-50%, -50%) rotate(-36deg) }
      75%  { transform: translate(-50%, -50%) rotate(-24deg) }
      100% { transform: translate(-50%, -50%) rotate(-36deg) }
   }

   @keyframes BlackRing_wiggle {

      0%   { top: 53%; left: 72%;  }
      50%  { top: 47%; left: 68%;  }
      100% { top: 53%; left: 72%;  }
   }

</style>
