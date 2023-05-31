
<template>

   <MainPage/>

</template>

<script>
   import MainPage from "./Components/MainPage.vue"

   export default {
      name: "App",

      components: {
         MainPage,
      }
   }
</script>

<style>
   html * {
      margin: 0;
      padding: 0;
      /* cursor: default; */
   }

   .flexCenter {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      width: 100%;
   }

   li {
      list-style: none;
   }

   /* Roboto Medium */
   @font-face {
      font-family: "Roboto-Medium";
      font-display: auto;
      src: url("./fonts/Roboto-Medium.ttf");
   }

   h1, h2, h3, h4, h5, h6 {
      font-family: "Roboto-Medium";
      line-height: 100%;
      font-weight: 600;
      font-size: 120%;
   }

   p, li {
      font-family: "Roboto-Medium";
      line-height: 100%;
      font-weight: 400;
      font-size: 112%;
   }

   .btn {
      border: none;
      border-radius: 15px;
      height: 60px;
      width: 180px;
      background: linear-gradient(to bottom right, rgb(255, 217, 0), rgb(255, 94, 0));
      transition-duration: 0.5s;
      
      font-family: "Roboto-Medium";
      line-height: 100%;
      font-weight: 400;
      font-size: 130%;
   }

   .red-btn {
      background: linear-gradient(to bottom right, pink, red);
   }

   .green-btn {
      background: linear-gradient(to bottom right, greenyellow, rgb(0, 170, 0));
   }

   .cancel-btn {
      background: linear-gradient(to top left, rgb(255, 217, 0), rgb(255, 94, 0));
   }

   .btn:hover {
      box-shadow: rgb(40, 40, 40) 5px 5px 5px;
   }

   .btn:active {
      border-top: solid grey 5px;
      border-left: solid grey 5px;
      transition-duration: 0s;
   }
</style>
