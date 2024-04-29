<script setup lang="ts">
import { defineEmits } from 'vue';
defineOptions({
    inheritAttrs: false,
})
defineProps({
    contentButton:String
})
const emit = defineEmits<{
    (e:'click',id:number):void
}>();
function onClickButtonHandler() {
    emit('click', 1);
}
</script>

<template>
    <div class="container">
        <button @click="onClickButtonHandler">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <p>{{ $props.contentButton }}</p>
        </button>
        <svg>
            <defs>
                <filter id="goo">
                    <feGaussianBlur stdDeviation="10"/>
                    <feColorMatrix
                        values="1 0 0 0 0
                            0 1 0 0 0
                            0 0 1 0 0
                            0 0 0 100 -15"/>
                    <feBlend in="SourceGraphic"/>
                </filter>
            </defs>
        </svg>
   </div>
</template>

<style scoped>
.container{
    width:220px;    
    height:auto;
    margin-top:0px;
    filter:url(#goo);
}
    button{
        background: none;
        cursor: pointer;
        font:inherit;
        padding: 0;
        color:inherit;
        width:220px;
        height: 80px;
        position: relative;
        transition: .5s;
        border: none;
    }
    button span{
        display: block;
        width:20px;
        height: 100%;
        top:50%;
        transform: translate(0,-50%);
        position: absolute;
        background-color:#c2bfb6;
        transition: 0.7s cubic-bezier(0,2,0.7,2);
    }
    button:hover span{
        height: 120%;
        transition:.4s cubic-bezier(0.1,1,0.2,4);
    }
    button span:nth-child(1){
        transition-delay: .25s;
        left:0px;
    }
    button span:nth-child(2){
        transition-delay: .2s;
        left:20px;
    }
    button span:nth-child(3){
        transition-delay: .15s;
        left:40px;
    }
    button span:nth-child(4){
        transition-delay: .1s;
        left:60px;
    }
    button span:nth-child(5){
        transition-delay: .05s;
        left:80px;
    }
    button span:nth-child(6){
        transition-delay: .0s;
        left:100px;
    }
    button span:nth-child(7){
        transition-delay: .05s;
        left:120px;
    }
    button span:nth-child(8){
        transition-delay: .1s;
        left:140px;
    }
    button span:nth-child(9){
        transition-delay: .15s;
        left:160px;
    }
    button span:nth-child(10){
        transition-delay: .20s;
        left:180px;
    }
    button span:nth-child(11){
        transition-delay: .25s;
        left:200px;
    }
    p{
        color:white;
        font-size: 2rem;
        z-index:100;
        position: relative;
        transition: 0.5s;
    }
    button:hover p{
        color:gray;
    }
    @media screen and (max-width: 430px) {
        .container{
            transform: scale(0.8);
        }
    }
</style>