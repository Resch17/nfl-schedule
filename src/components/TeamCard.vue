<template>
    <div class="team" v-if="homeAway === 'away'">
        <img :src="game.awayTeam.logo" alt="team logo" v-if="logosCheck" />
        <div class="teamscore">
            <h4>
                {{ `${game.awayTeam.name || game.awayTeam.location} ` }}
            </h4>
            <h4 v-if="game.quarter > 0">
                {{ game.awayScore }}
            </h4>
        </div>
    </div>
    <div class="team" v-else>
        <div class="teamscore">
            <h4>
                {{ ` ${game.homeTeam.name || game.homeTeam.location}` }}
            </h4>
            <h4 v-if="game.quarter > 0">
                {{ game.homeScore }}
            </h4>
        </div>
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
    margin: 0;
}
@media screen and (max-width: 700px) {
    img {
        width: 50px;
        height: auto;
    }
    .team {
        width: 170px !important;
        display: flex;
        flex-direction: column-reverse;
    }
    .teamscore {
        display: flex;
        flex-direction: column;
    }
    h4 {
        margin: 0 !important;
    }
}
@media screen and (max-width: 400px) {
    .team {
        width: 110px !important;
    }
}
</style>
