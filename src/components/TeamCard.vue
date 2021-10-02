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
</style>
