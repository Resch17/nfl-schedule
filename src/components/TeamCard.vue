<template>
    <div v-if="homeAway === 'away'">
        <img :src="game.awayTeam.logo" alt="team logo" v-if="logosCheck" />
        <h4>
            {{ `${game.awayTeam.name || game.awayTeam.location} ` }}
        </h4>
    </div>
    <div v-else>
        <h4>
            {{ ` ${game.homeTeam.name || game.homeTeam.location}` }}
        </h4>
        <img :src="game.homeTeam.logo" alt="team logo" v-if="logosCheck" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: ['homeAway', 'game', 'logosCheck'],
});
</script>

<style scoped>
.completed div img {
    filter: grayscale(100%);
}
img {
    width: 100px;
    height: auto;
}
div {
    padding: 5px;
    width: 300px;
    justify-content: space-evenly;
}
h4 {
    font-size: 20px;
}
@media screen and (max-width: 700px) {
   img {
       width: 50px;
       height: auto;
   } 
   div {
       display: flex !important;
       flex-direction: column !important;
       width: 170px !important;
   }
   h4 {
       margin: 0 !important;
   }
   .home div {
       flex-direction: column-reverse !important;
   }
}
@media screen and (max-width: 400px) {
    div {
        width: 110px !important;
    }
}
</style>
