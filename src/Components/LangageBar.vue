<template>
   <section class="flexCenter lang">

      <button class="flexCenter fr" @click="handleLanguage('FR')">
         <div class="flag"/>
         <p   class="text">Français</p>
      </button>

      <button class="flexCenter en" @click="handleLanguage('EN')">
         <div class="flag"/>
         <p   class="text">English</p>
      </button>

      <button class="flexCenter jp" @click="handleLanguage('JP')">
         <div class="flag"/>
         <p   class="text">日本語</p>
      </button>

   </section>
</template>


<script>
   export default {
      
      methods: {
         
         handleLanguage(lang) {
            this.$emit("changeLang", lang);
         },
      },
   }
</script>


<style scoped lang="scss">

   $hoverScale: 77%;
   $flagScale:  70%;
   $clickScale: 63%;

   .lang {
      z-index: 100;
      position: fixed;
      justify-content: space-between;
      top: 0px;
      right: 0px;
      height: 100px;
      width: 360px
   }

   button {
      border: none;
      background: none;
      width: 120px;
   }

   button:hover .flag {
      transform: scale($hoverScale);
      opacity: 70%;
   }

   button:active .flag {
      transform: scale($clickScale);
   }

   .flag {
      background: url("../../images/flags.png") no-repeat;
      align-content: flex-end;
      transform: scale($flagScale);
      height: 90px;
      width: 120px;
   }

   .text {
      font-family: verdana;
      font-weight: 600;
      font-size: 16px;
      margin-top: -10px;
   }

   .en .flag {
      background-position: -5px -4px;
   }

   .fr .flag {
      background-position: -136px -5px;
   }

   .jp .flag {
      background-position: -267px -4px;
   }

</style>