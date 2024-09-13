
<template>
   <ul v-if="isLoaded" class="flexCenter flow">
      <div class="flexCenter" v-for="row in projectsList" :key="row" ref="projectRow">

         <Project v-for="project in row" :key ="project.id" ref="projectElem"
            :id           ="project.id"
            :project      ="project"
            :langPack     ="langPack"
            :selectedLang ="selectedLang"
            :socket       ="socket"
            @closeOthers  ="closeOtherProject"
         />

      </div>
   </ul>
</template>

<script>
   import Project from "./Project.vue"

   export default {

      components: {
         Project,
      },
      
      props: {
         selectedLang: String,
         socket:       Object,
      },

      data() {
      return {
         isLoaded:     false,
         responseList: [],
         langPack:     {},
      }},

      // ==> For async props 
      // watch: {
      //    responseList(newValue) {
      //       if(newValue) this.generateProjects(newValue);
      //    },
      // },

      async mounted() {

         await this.getProjects();
         await this.getLangPack();

         await this.$nextTick(() => setTimeout(() => {
            this.generateProjects();
         }, 0));
      },

      methods: {

         closeOtherProject(projectID) {
            const projectRef = this.$refs.projectElem;

            for(let i = 0; i < projectRef.length; i++) {
               const project = projectRef[i];
               
               if(project.isOpen && i !== projectID) project.closeProject();
            }
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
            this.isLoaded     = true;

            this.$nextTick(() => setTimeout(() => {
               const lastIndex = this.$refs.projectRow.length -1;
               if(tempsList.length === 2) this.$refs.projectRow[lastIndex].classList.add("space-between");
            }, 0));
         },
      }
   }
</script>

<style scoped lang="scss">

   .flow {
      z-index: 50;
      scrollbar-width: none;
      position: fixed;
      justify-content: flex-start;
      top: 0;
      left: 0;
      overflow: auto;
      overflow-x: hidden;
      height: 100%;
      width: 50%;
   }

   .space-between {
      justify-content: space-between;
      margin-bottom: 50px;
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

      .space-between {
         margin-bottom: 15px;
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
