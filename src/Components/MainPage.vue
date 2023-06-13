<template>
   <section class="flexCenter main">

      <div class="background"/>
      
      <LangBar class="lang-bar"
         @changeLang="updateLang"
      />

      <SpaceParticules class="constellation"/>
      
      <div class="spinal-1">
         <div class="back"/>
      </div>
      
      <div class="spinal-2">
         <div class="bot"/>
         <Spin :style="varSpinBot"/>
         <Spin :style="varSpinMid1"/>
         <Spin :style="varSpinMid2"/>
         <Spin :style="varSpinTop"/>
         <div class="top"/>
      </div>

      <ul :key="project" class="flexCenter flow">
         
         <Project v-for="project in projects"
            :ref          ="`${project.id}`"
            :key          ="project.id"
            :project      ="project"
            :langPack     ="langPack"
            :selectedLang ="selectedLang"
            @toggleProject="projectsDisplay"
         />

      </ul>

   </section>
</template>


<script>
   import Project         from "./Project.vue"
   import Spin            from "./Spin.vue"
   import LangBar         from "./LangBar.vue"
   import SpaceParticules from "./SpaceParticules.vue"

   export default {
      name: "MainPage",

      components: {
         Project,
         Spin,
         LangBar,
         SpaceParticules,
      },

      data() {
      return {
         project: {},
         projects: {},
         langPack: {},
         selectedLang: "FR",
      }},

      beforeMount() {
         this.wakeUp_HeroicAdv();
         this.getLangPack();
         this.getProjects();
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

      methods: {
         async wakeUp_HeroicAdv () {

            await fetch("https://heroic-adventure.onrender.com/wake")
            .then(response => { return response.json()})
            .then(data => console.log(data) )
         },

         async getProjects() {
            const response = await fetch("./projects.json")
            .then(data => { return data.json() });
            this.projects = response.sort().reverse();
         },

         async getLangPack() {
            this.langPack = await fetch("./lang.json")
            .then(data => { return data.json() });
         },

         projectsDisplay(projectID) {
            Object.values(this.projects).forEach(project => {

               const projectComponent = this.$refs[`${project.id}`][0];
               if(projectID === project.id || !projectComponent.isOpen) return;
               this.$refs[`${project.id}`][0].toggle();
            });
         },

         updateLang(lang) {
            this.selectedLang = lang;
         },

      },
   }
</script>


<style scoped lang="scss">

   .main {
      position: fixed;
      top: 0px;
      left: 0px;
      height: 100%;
      width: 100%;
   }

   .background {
      height: 100%;
      width: 100%;
      background: linear-gradient(to bottom right,
         black,
         dimgray,
            dimgray,
            dodgerblue,
            dodgerblue,
            lightblue,
            lightblue,
            dodgerblue,
         dimgray,
         black
      );
   }

   .flow {
      z-index: 50;
      scrollbar-width: none;
      position: fixed;
      justify-content: flex-start;
      top: 0;
      left: 0;
      overflow: auto;
      overflow-x: hidden;
      height: 98%;
      width: 67%;
      padding-right: 700px;
   }
   
   .constellation {
      z-index: 10;
   }

   .spinal-1 {
      z-index: 5;
      position: fixed;
      top: 50%;
      left: 70%;
      height: 100px;
      width: 100px;
      transform: translate(-50%, -50%) rotate(-30deg);

      .back {
         z-index: 9;
         position: absolute;
         top: 50%;
         left: 50%;
         height: 1400px;
         width: 1400px;
         border-radius: 50%;
         transform: translate(-50%, -50%) rotateX(-72deg);
         background: radial-gradient(circle at center, transparent, black, transparent, transparent);
      }
   }
   
   .spinal-2 {
      z-index: 15;
      position: fixed;
      top: 50%;
      left: 70%;
      height: 100px;
      width: 100px;
      transform: translate(-50%, -50%) rotate(-30deg);

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

</style>