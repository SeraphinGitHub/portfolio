<template>
    <li class="flexCenter project-frame bgd-1" ref="projectRef">

        <div class="gold-frame"/>

        <figure class="flexCenter fig" @click="toggleProject()">
            <img :src="project.imageUrl">
            <div class="flexCenter white-filter"></div>
        </figure>
        
        <div class="flexCenter project-caption">
            <div class="flexCenter title">
                <h2>{{ project.title[selectedLang][0] }}</h2>
                <h2>{{ project.title[selectedLang][1] }}</h2>
            </div>

            <span class="flexCenter created-at">
                <h3>{{ langPack.creation[selectedLang] }} :</h3>
                <p> {{ project.createdAt[selectedLang] }}</p>
            </span>
            
            <span class="flexCenter description">
                <h3>{{ langPack.description[selectedLang] }} :</h3>
                <p> {{ project.description [selectedLang] }}</p>
            </span>
            
            <div v-show="project.skills" class="flexCenter skills">
                <h3>{{ langPack.technologies[selectedLang] }} :</h3>
                <li v-for="skill in skills" :key="skill">{{ skill }}</li>
            </div>
        </div>

        <button class="flexCenter btn green-btn switch-to-btn" @click="goToPage()">
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"/>
            </svg>
            <p>{{ langPack.openLink[selectedLang] }}</p>
        </button>

    </li>
</template>


<script>
    export default {
        name: "Project",

        props: {
            project:      Object,
            langPack:     Object,
            selectedLang: String,
        },

        data() {
        return {
            skills:     "",
            isOpen:     false,
            projectDOM: {},
        }},

        beforeMount() {
            this.skills = this.project.skills;
        },

        mounted() {
            this.init();
        },

        methods: {

            init() {
                const projectRef = this.$refs.projectRef;
                const goldFrame  = projectRef.querySelector(".gold-frame");

                this.projectDOM = {
                    project: projectRef,
                    figure:  projectRef.querySelector(".fig"),
                    caption: projectRef.querySelector(".project-caption"),
                    btn:     projectRef.querySelector(".switch-to-btn"),
                    filter:  projectRef.querySelector(".white-filter"),
                }

                if(this.project.id % 2 === 0) {
                    projectRef.classList.add("bgd-2");
                    projectRef.classList.remove("bgd-1");
                }

                if(this.project.isGolden) goldFrame.classList.add("show-gold");
            },
            
            toggleProject() {

                if(!this.isOpen) {
                    this.openProject();
                    this.$emit("closeOthers", this.project.id);
                }
                else this.closeProject();
            },

            openProject() {

                this.isOpen = true;
                const { project, figure, caption, btn, filter } = this.projectDOM;

                project.classList.remove("close-project");
                figure.classList.remove("close-fig");
                caption.classList.remove("close-caption");
                btn.classList.remove("close-btn");

                project.classList.add("open-project");
                figure.classList.add("open-fig");
                caption.classList.add("open-caption");
                btn.classList.add("open-btn");

                filter.style = "display: none";
            },

            closeProject() {

                this.isOpen = false;
                const { project, figure, caption, btn, filter } = this.projectDOM;

                project.classList.remove("open-project");
                figure.classList.remove("open-fig");
                caption.classList.remove("open-caption");
                btn.classList.remove("open-btn");

                project.classList.add("close-project");
                figure.classList.add("close-fig");
                caption.classList.add("close-caption");
                btn.classList.add("close-btn");

                setTimeout(() => {
                    filter.style = "display: flex";
                    project.classList.remove("close-project");
                    figure.classList.remove("close-fig");
                    caption.classList.remove("close-caption");
                    btn.classList.remove("close-btn");
                }, 700);  
            },

            goToPage() {
                window.open(this.project.href);
            },
        },
    }
</script>


<style scoped lang="scss">

    $marginBase: 15px;
    $projectWidth: 370px;
    $projectSize: $projectWidth *0.7;
    $figHeigth: 155px;
    $captionHeigth: 65px;
    $btnTranslate: 120%;

    /* ******************************* Gold Frame ******************************* */
    $size: 15px;
    $color: yellow;

    .gold-frame {
        display: none;
        position: absolute;
        height: 100%;
        width: 100%;
    }

    .show-gold {
        display: flex;
        animation: rotateGold 2s linear infinite;
    }

    @keyframes rotateGold {
        0%  { box-shadow: inset 0 0 $size $size $color };
        50% { box-shadow: inset 0 0 0     0   $color };
        100%{ box-shadow: inset 0 0 $size $size $color };
    }
    /* ******************************* Gold Frame ******************************* */
    
    .project-frame {
        position: relative;
        justify-content: space-between;
        overflow: hidden;
        height: $projectSize;
        width: $projectWidth;
        margin: 50px;
        margin-bottom: 0px;
        border-radius: $marginBase + 15px 0 $marginBase + 15px 0;
        border: 3px solid black;
    }

    .bgd-1 {
        background: linear-gradient(to bottom left, gold, darkviolet, black);
    }

    .bgd-2 {
        background: linear-gradient(to bottom left,  lime, dodgerblue, black);
    }

    
    /* ========== Picture ========== */
    .project-frame {
        figure {
            position: relative;
            overflow: hidden;
            height: $figHeigth;
            width: 90%;
            margin: auto;
            margin-top: $marginBase;
            margin-bottom: 0;
            border-radius: $marginBase 0 $marginBase 0;
        }
        
        img {
            cursor: pointer;
            object-fit: cover;
            height: 100%;
            width: 100%;
            background: white;
        }
    }


    .white-filter {
        cursor: pointer;
        position: absolute;
        height: 100%;
        width: 0;
        opacity: 0;
        background: black;
    }
    

    $titleWidth: 60%;
    
    /* ========== Caption ========== */
    .project-caption {
        position: relative;
        justify-content: space-between;
        overflow: hidden;
        height: $captionHeigth;
        margin: $marginBase;
        padding-left: 10px;
        padding-right: 10px;
        border-radius: $marginBase 0 $marginBase 0;
        background: linear-gradient(to bottom, rgb(130, 130, 130), rgb(245, 245, 245), rgb(110, 110, 110));
    }

    $marginTopBase: 5px;

    .title {
        justify-content: flex-start;
        width: $titleWidth;
        margin-top: 15px;
        margin-bottom: 10px;
        
        h2 {
            margin-right: 7px;
        }
    }


    .created-at {
        width: 100% - $titleWidth;
    }


    .created-at,
    .description,
    .skills {
        justify-content: flex-start;

        p {
            margin: 0;
            margin-top: $marginTopBase;
            line-height: 120%;
            font-size: 100%;
        }

        h3 {
            margin: 0;
            margin-top: $marginTopBase;
            margin-right: 10px;
            font-size: 110%;
            font-weight: 400;
            text-decoration-line: underline;
            text-underline-offset: 4px;
            text-decoration-thickness: 2px;
        }
    }
    

    $paddingSide: 40px;
    /* ========== Skills List ========== */
    .skills {
        padding-left: $paddingSide;
        margin-bottom: $marginTopBase + 5px;
        
        h3 {
            width: 100%;
            margin-left: - $paddingSide;
        }

        li {
            list-style-type: disc;
            width: 25%;
            margin-top: 8px;
            font-size: 100%;
        }
    }



    /* ========== Buttons ========== */
    .switch-to-btn {
        cursor: pointer;
        justify-content: space-around;
        height: 80px;
        width: 25%;
        margin: $marginBase;
        transform: translateX($btnTranslate);
    }

    .fa-sign-in-alt {
        font-size: 140%;
    }


    $delay: 0s;
    // ========= Transition Class =========
    .open-project {
        z-index: 100;
        height: 650px;
        width: 100%;
    }

    .open-fig {
        margin-left: auto !important;
        margin-right: auto !important;
        height: 393px !important;
        width: 70% !important;
    }

    .open-caption {
        height: 215px;
        width: 65%;
        margin-right: 0;
    }

    .open-btn {
        padding-right: 30px;
        transform: translateX(-10%);
        transition-delay: $delay + 0.3;
    }

    .close-project {
        height: $projectSize;
        transition-delay: $delay;
    }

    .close-fig {
        margin-left: auto !important;
        margin-right: auto !important;
        height: $figHeigth;
        transition-delay: $delay;
    }

    .close-caption {
        height: $captionHeigth;
        transition-delay: $delay;
    }

    .close-btn {
        transform: translateX($btnTranslate);
    }

    .open-project,
    .open-fig,
    .open-caption,
    .open-btn,
    .close-project,
    .close-fig,
    .close-caption,
    .close-btn {
        transition-duration: 0.7s;
    }


    .fig:hover > .white-filter {
        opacity: 50%;
        width: 100%;
        transition-duration: 0.5s;
    }

    @media screen and (max-width : 1919px) {

        .project-frame {
            margin: 15px;
            height: 245px;
            width: 310px;

            figure {
                margin: 15px;
                margin-bottom: 0px;
                height: 140px;
            }

            h2, h3 {
                font-size: 100%;
            }

            p {
                font-size: 90%;
            }
        }

        .open-project {
            height: auto;
            width: 100%;
        }

        .open-fig {
            width: 84% !important;
        }

        .project-caption {
            margin: 15px;

            h2,
            .title {
                width: 100%; 
            }
        }

        .open-caption {
            height: auto;

            h2,
            .title {
                width: 75%; 
            }
        }

        .created-at {
            width: 24%;
        }

        .description {
            height: auto;
            margin-bottom: 10px;
        }

        .skills {
            height: auto;
            
            li {
                width: 50%;
            }
        }
        
        .switch-to-btn {
            padding-right: 0px;
            width: 22%;
            margin: 10px;
        }
    }

</style>