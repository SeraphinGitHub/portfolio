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

      <ul class="flexCenter flow">

         <div class="flexCenter" v-for="row in projectsList" :key="row" ref="projDivRef">

            <Project v-for="project in row" :key ="project.id" ref="projElemRef"
               :id           ="project.id"
               :project      ="project"
               :langPack     ="langPack"
               :selectedLang ="selectedLang"
               @closeOthers  ="closeOtherProject"
            />
         </div>

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
         projectsList: [],
         responseList: [],
         langPack:     {},
         selectedLang: "FR",
         projectToWake: [
            "https://heroic-adventure.onrender.com/wake",
            // "https://bf-manager.onrender.com/wake",
         ]
      }},

      async mounted() {
         
         await this.wakeUpProjects();
         await this.getLangPack();
         await this.getProjects();

         this.generateProjects();
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

         closeOtherProject(projectID) {
            const projectRef = this.$refs.projElemRef;

            for(let i = 0; i < projectRef.length; i++) {
               const project = projectRef[i];
               
               if(project.isOpen && i !== projectID) project.closeProject();
            }
         },

         async wakeUpProjects () {
            
            this.projectToWake.forEach(async (projectURL) => {

               await fetch(projectURL)
               .then( response => { return response.json() })
               .then( data     => { console.log(data)      })
               .catch(error    => { console.log(error)     });
            });
         },

         async getProjects() {
            this.responseList = await fetch("./projects.json")
            .then(data => { return data.json() });
            
            this.responseList.sort().reverse();
         },

         async getLangPack() {
            this.langPack = await fetch("./lang.json")
            .then(data => { return data.json() });
         },

         updateLang(lang) {
            this.selectedLang = lang;
         },

         generateProjects() {

            let id    = 0;
            let count = 0;
            let isPair = false;

            let tempsList    = [];
            let projectsList = [];

            this.responseList.forEach((project) => {
               project["id"] = id;
               id++;
               count++;

               tempsList.push(project);

               if(count === 3 && !isPair
               || count === 2 &&  isPair) {

                  count  = 0;
                  isPair = !isPair;
                  projectsList.push(tempsList);
                  tempsList = [];
               }
            });

            if(tempsList.length > 0) projectsList.push(tempsList);

            this.projectsList = projectsList;

            this.$nextTick(() => {
               const lastIndex = this.$refs.projDivRef.length -1;
               if(tempsList.length === 2) this.$refs.projDivRef[lastIndex].classList.add("space-between");
            });
         },

      },
   }
</script>


<style scoped lang="scss">

   .space-between {
      justify-content: space-between;
   }

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
      width: 50%;
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

   @media screen and (min-width : 2600px) {
      .flow {
         width: 55%;
      }
   }

   @media screen and (max-width : 2599px) {
      .flow {
         width: 75%;
      }
   }

   @media screen and (max-width : 1599px) {
      .flow {
         width: 40%;
      }

      .space-between {
         justify-content: center;
      }
   }

</style>