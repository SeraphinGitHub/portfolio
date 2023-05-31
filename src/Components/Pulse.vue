<template>
    <section>

        <span class="pulse pulse-top"></span>
        <span class="pulse pulse-right"></span>
        <span class="pulse pulse-bottom"></span>
        <span class="pulse pulse-left"></span>

    </section>
</template>


<script>
    export default {
        name: "Pulse",
    }
</script>


<style scoped lang="scss">
    .pulse {
        visibility: hidden;
        position: absolute;
        height: 10px;
        width: 100px;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        background: linear-gradient(to right, transparent, darkviolet);
    }


    $delay: 0.8s;
    $animDuration: 2s;
    .pulse-top {
        top: 5px;
        left: 30px;

        animation: pulseTop $animDuration linear infinite;
        animation-delay: $delay;
    }

    .pulse-right {
        top: 70px;
        right: -40px;
        transform: rotateZ(90deg);

        animation: pulseRight $animDuration linear infinite;
        animation-delay: $delay;
    }

    .pulse-bottom {
        top: 418px;
        right: 30px;
        transform: rotateZ(180deg);
        
        animation: pulseBottom $animDuration linear infinite;
        animation-delay: $delay;
    }

    .pulse-left {
        top: 418px;
        left: -40px;
        transform: rotateZ(-90deg);

        animation: pulseLeft $animDuration linear infinite;
        animation-delay: $delay;
    }


    // =====================================================================================================
    // Animations
    // =====================================================================================================
    @keyframes pulseTop {
        0% { visibility: hidden };
        1% { visibility: visible };
        69% { transform: translateX(700px) };
        70% { visibility: hidden; transform: translateX(700px) };
        100% { visibility: hidden };
    }

    @keyframes pulseRight {
        0% { visibility: hidden };
        70% { visibility: hidden };
        71% { visibility: visible; transform: rotateZ(90deg) };
        99% { transform: rotateZ(90deg) translateX(310px) };
        100% { visibility: hidden; transform: rotateZ(90deg) translateX(310px) };
    }

    @keyframes pulseBottom {
        0% { visibility: hidden };
        1% { visibility: visible };
        69% { transform: rotateZ(180deg) translateX(700px) };
        70% { visibility: hidden; transform: rotateZ(180deg) translateX(700px) };
        100% { visibility: hidden };
    }

    @keyframes pulseLeft {
        0% { visibility: hidden };
        70% { visibility: hidden };
        71% { visibility: visible; transform: rotateZ(-90deg)};
        99% { transform: rotateZ(-90deg) translateX(350px) };
        100% { visibility: hidden; transform: rotateZ(-90deg) translateX(350px) };
    }
</style>