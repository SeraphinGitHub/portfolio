<template>
    <section class="flexCenter spin-container">
    
        <div class="ring-1">
            <div class="nose"></div>
            <div class="tail"></div>
        </div>

        <div class="ring-2">
            <div class="nose"></div>
            <div class="tail"></div>
        </div>

    </section>
</template>


<script>
    export default {
        name: "Spin",

        props: {
            noseColor:  String,
            tailColor:  String,
            size:       String,
            top:        String,
            left:       String,
            startAngle: String,
            endAngle:   String,
            anim:       String,
        },
    }
</script>


<style scoped lang="scss">

    $noseDeg: 30deg;
    $offsetX: 20%;
    $offsetY: 10%;

    .spin-container {
        position: absolute;
        top:    var(--top);
        left:   var(--left);
        height: var(--size);
        width:  var(--size);
        transform: translate(-50%, -50%) rotateX(30deg);

        .ring-1 {
            .nose {
                border-top-color: var(--noseColor);
                transform: translate(-$offsetX, -$offsetY) rotate($noseDeg);
            }

            .tail {
                border-top-color: var(--tailColor);
                transform: translate(-$offsetX, -$offsetY) rotate(0deg );
            }
        }

        .ring-2 {
            .nose {
                border-top-color: var(--noseColor);
                transform: translate($offsetX, $offsetY) rotate($noseDeg + 180deg);
            }

            .tail {
                border-top-color: var(--tailColor);
                transform: translate($offsetX, $offsetY) rotate(0deg + 180deg);
            }
        }
    }


    // =====================================================================================================
    // Rings settings
    // =====================================================================================================    
    .nose,
    .tail {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: transparent;
    }

    .nose {
        border-top: solid 50px;
    }

    .tail {
        border-top: solid 30px;
    }

    .ring-1,
    .ring-2 {
        position: absolute;
        width: 100%;
        height: 100%;
        transform: scaleY(25%);
        animation: spinAnim var(--anim) linear infinite;
    }


    // =====================================================================================================
    // Animations
    // =====================================================================================================
    @keyframes spinAnim {
        0%   {transform: scaleY(25%) rotate( var(--startAngle)) }
        100% {transform: scaleY(25%) rotate( var(--endAngle  )) }
    }

</style>