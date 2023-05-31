<template>
    <section class="loading-puzzle">
        
        <div class="top-left">
            <div class="bar"></div>
            <div class="ring"></div>
        </div>

        <div class="top-right">
            <div class="bar"></div>
            <div class="ring"></div>
        </div>

        <div class="bottom-left">
            <div class="bar"></div>
            <div class="ring"></div>
        </div>

        <div class="bottom-right">
            <div class="bar"></div>
            <div class="ring"></div>
        </div>

    </section>
</template>


<script>
    export default {
        name: "LoadingPuzzle",
    }
</script>


<style scoped lang="scss">

    $size: 540px;
    .loading-puzzle {
        overflow: hidden;
        position: absolute;
        height: $size;
        width: 500px;
        top: 0px;
        right: 0px;
    }


    $vertical: 0px;
    $horizontal: 115px;
    .top-left {
      top: $vertical;
      left: $horizontal;
      transform: rotateZ(180deg);
    }

    .top-right {
      top: $vertical;
      right: $horizontal;
      transform: rotateZ(270deg);
    }

    .bottom-right {
      bottom: $vertical;
      right: $horizontal;
    }

    .bottom-left {
      bottom: $vertical;
      left: $horizontal;
      transform: rotateZ(90deg);
    }


    $thickness: 20px;
    $height: 100px;
    $ringSize: 90px;
    $color: lime;
    
    .top-left,
    .top-right,
    .bottom-right,
    .bottom-left {
        position: absolute;
        height: $ringSize * 4.5;
        width: $ringSize * 1.5;
    }


    $animDuration: 3s;
    .bar {
        position: absolute;

        height: $height;
        width: $thickness;
        top: -$height;
        left: $ringSize + $thickness;
        
        background: $color;
        transform-origin: bottom;

        animation: bar $animDuration linear infinite;
    }

    .ring {
        position: absolute;

        height: $ringSize;
        width: $ringSize;
        top: $ringSize * 1.5;
        left: 1px;

        border-radius: 50%;
        border: solid $thickness transparent;
        border-top-color: $color;
        transform: rotateZ(135deg);

        animation: ring $animDuration linear infinite;
    }
    


    // =====================================================================================================
    // Animations
    // =====================================================================================================
    @keyframes bar {
        0%{ top: -$height };
        10%{ top: 100px };
        30%{ top: 200px };
        40%{ top: $ringSize * 4.5 };
        100%{ top: $ringSize * 4.5 };
    }

    @keyframes ring {
        0%{ transform: rotateZ(135deg) };
        10%{ transform: rotateZ(135deg) };
        30%{ transform: rotateZ(405deg) };
        70%{ transform: rotateZ(135deg) };
        100%{ transform: rotateZ(135deg) };
    }



</style>