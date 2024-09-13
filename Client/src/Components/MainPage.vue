<template>
   <section class="flexCenter fullCover hide" ref="main">

      <div class="black-filter fullCover"/>
      
      <LangageBar
         @changeLang ="updateLang"
      />

      <ConstellationParticules class="constellation"
         :density   ="300"
         :starRange ="30"
         :starSize  ="10"
         :linkDist  ="120"
         :socket    ="socket"
      />

      <RainParticules class="rain fullCover"
         :height   ="height"
         :width    ="width"
         :density  ="400"
         :velocity ="1.2"
         :size     ="2.2"
         :hasTrail ="false"
      />
      
      <RainParticules class="rain fullCover"
         :height   ="height"
         :width    ="width"
         :density  ="150"
         :velocity ="3"
         :size     ="2"
         :hasTrail ="true"
      />
      
      <Galaxy/>

      <ProjectFlow ref="projectFlow"
         :selectedLang  ="selectedLang"
         :socket        ="socket"
      />

   </section>
</template>


<script>
   window.logData = true;

   import LangageBar                from "./LangageBar.vue"
   import Galaxy                    from "./Galaxy/__Galaxy.vue"
   import ConstellationParticules   from "./ConstellationParticules/__ConstellationParticules.vue"
   import RainParticules            from "./RainParticules/__RainParticules.vue"
   import ProjectFlow               from "./ProjectFlow.vue"

   import { io }                    from "socket.io-client";

   export default {
      name: "MainPage",

      components: {
         LangageBar,
         Galaxy,
         ConstellationParticules,
         RainParticules,
         ProjectFlow,
      },

      data() {
      return {
         // URL:          "http://localhost:3000",
         URL:          "https://psf-manager.onrender.com",
         height:        window.innerHeight,
         width:         window.innerWidth,
         selectedLang: "FR",
         openSession:   Date.now(),
         socket:        null,
         
         projectToWake: [
            "https://psf-manager.onrender.com/wake",
            "https://heroic-adventure.onrender.com/wake",
            // "https://bf-manager.onrender.com/wake",
         ],
      }},

      async mounted() {
         await this.wakeUpProjects();

         this.$nextTick(() => setTimeout(() => {

            this.socket = io(this.URL, {
               transports:      ["websocket", "polling"],
               withCredentials: true,
            });

            this.socket.on("socketConnected", () => {
               this.socket.emit("socketSend", {
                  openSession:  this.openSession,
                  selectedLang: this.selectedLang,
               });

               this.update();
            });

            this.$refs.main.classList.add("show");
            this.$refs.main.classList.remove("hide");
         }, 0));
      },

      methods: {

         async wakeUpProjects () {
            
            this.projectToWake.forEach(async (projectURL) => {

               await fetch(projectURL);
            });
         },         

         updateLang(value) {
            this.selectedLang = value;
            this.socket.emit("socketSend", { lang: value });
         },

         update() {

            const inter_0 = setInterval(() => {
               this.socket.emit("socketSend", { update: true });

               if(!logData) {
                  clearInterval(inter_0);
                  this.socket.emit("logData");
               }
            }, 1000);
         }
      },
   }
</script>


<style scoped lang="scss">

   $DayNightAnim: 60s;

   .constellation {
      z-index: 10;
   }

   .rain {
      // opacity: 60%;
      animation: Day_and_Night $DayNightAnim ease-in-out infinite;
   }

   .black-filter {
      background: black;
      // opacity: 40%;
      animation: Day_and_Night $DayNightAnim ease-in-out infinite;
   }

   @keyframes Day_and_Night {
      0%  { opacity: 6%;  }
      15% { opacity: 6%;  }
      35% { opacity: 42%; }
      65% { opacity: 42%; }
      85% { opacity: 6%;  }
      100%{ opacity: 6%;  }
   }

</style>