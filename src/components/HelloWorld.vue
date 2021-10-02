<template>
    <div class="print" v-if="showPrint">
        <div v-for="game in games" :key="game.id">
            {{
                `${game.awayTeam.name || game.awayTeam.location} @ ${game
                    .homeTeam.name || game.homeTeam.location}`
            }}
        </div>
    </div>

    <label for="showPrint">Show printable</label>
    <input
        type="checkbox"
        name="showPrint"
        id="showPrint"
        v-model="showPrint"
    />
    <div class="hello">
        <label for="logosCheck">Logos on/off</label>
        <input
            type="checkbox"
            name="logosCheck"
            id="logosCheck"
            v-model="logosCheck"
        />
        <div class="week-container">
            <i
                class="fas fa-arrow-alt-circle-left fa-2x"
                @click="changeWeek('down')"
            ></i>
            <h1>Week {{ week }}</h1>
            <i
                class="fas fa-arrow-alt-circle-right fa-2x"
                @click="changeWeek('up')"
            ></i>
        </div>
        <main>
            <div v-for="game in games" :key="game.id" class="game">
                <div class="date">{{ game.date }}</div>
                <div class="teams">
                    <div class="away team" :class="teamStyle(game, 'away')">
                        <team-card
                            :game="game"
                            homeAway="away"
                            :logosCheck="logosCheck"
                        ></team-card>
                    </div>
                    <div class="at">{{ ' @ ' }}</div>
                    <div class="home team" :class="teamStyle(game, 'home')">
                        <team-card
                            :game="game"
                            homeAway="home"
                            :logosCheck="logosCheck"
                        ></team-card>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ApiService from '../services/apiService';
import TeamCard from './TeamCard.vue';

export default defineComponent({
    components: { TeamCard },
    name: 'HelloWorld',
    props: {
        msg: String,
    },
    data() {
        return {
            games: new Array<any>(),
            teams: new Array<any>(),
            week: 0,
            weekSelect: 4,
            logosCheck: true,
            showPrint: false,
        };
    },
    methods: {
        changeWeek(upOrDown: string) {
            switch (upOrDown) {
                case 'up':
                    if (this.weekSelect <= 16) {
                        this.weekSelect++;
                        this.refreshList(this.weekSelect);
                    }
                    break;
                case 'down':
                    if (this.weekSelect >= 2) {
                        this.weekSelect--;
                        this.refreshList(this.weekSelect);
                    }
                    break;
                default:
                    break;
            }
        },
        teamStyle(game: any, team: string) {
            if (game.completed) {
                let classes = 'completed ';
                if (team === 'home') {
                    if (game.homeTeam.winner) {
                        classes += 'winner';
                    } else {
                        classes += 'loser';
                    }
                } else {
                    if (game.awayTeam.winner) {
                        classes += 'winner';
                    } else {
                        classes += 'loser';
                    }
                }
                return classes;
            }
            return '';
        },
        async getList(selectedWeek) {
            const apiData: any = await ApiService.getAllGames(selectedWeek);
            const transformedGames = apiData.events.map((e) => {
                const gameDate = new Date(e.date);
                const gameObj = {
                    id: e.id,
                    date: `${gameDate.toLocaleString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                    })} @ ${gameDate.toLocaleTimeString('en-US', {
                        timeZone: 'America/Chicago',
                        timeZoneName: 'short',
                    })}`,
                    venue: e.competitions[0].venue.fullName,
                    homeTeam: e.competitions[0].competitors.find(
                        (c: { homeAway: string }) => c.homeAway === 'home'
                    ).team,
                    awayTeam: e.competitions[0].competitors.find(
                        (c: { homeAway: string }) => c.homeAway === 'away'
                    ).team,
                    completed: false,
                };
                if (e.status.type.completed) {
                    gameObj.completed = true;
                    if (
                        e.competitions[0].competitors.find(
                            (c) => c.homeAway === 'home'
                        ).winner === true
                    ) {
                        gameObj.homeTeam.winner = true;
                        gameObj.awayTeam.winner = false;
                    } else {
                        gameObj.homeTeam.winner = false;
                        gameObj.awayTeam.winner = true;
                    }
                }
                return gameObj;
            });
            this.games = transformedGames;
            this.week = apiData.week.number;
            console.log(transformedGames);
        },
        async refreshList(selectedWeek: number) {
            if (
                selectedWeek >= 1 &&
                selectedWeek < 18 &&
                selectedWeek !== this.week
            ) {
                this.getList(selectedWeek);
            }
        },
    },
    async created() {
        let defaultDate = new Date();
        if (defaultDate > new Date('2021-09-29T06:59Z')) {
            this.weekSelect = 4;
        }
        if (defaultDate > new Date('2021-10-06T06:59Z')) {
            this.weekSelect = 5;
        }
         
        this.getList(this.weekSelect);
    },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
    margin: 40px 0 0;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}
.teams,
.team div,
.week-container {
    display: flex;
    flex-direction: row;
    align-items: center;
}
.game {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-top: 3px solid black;
    width: 40%;
    margin: 1em auto;
    padding-top: 1em;
}
.date {
    margin-bottom: 0.5em;
}
.game,
.week-container {
    justify-content: center;
}
.week-container {
    h1 {
        margin: 0 1em;
    }
    i {
        cursor: pointer;
    }
}
.at {
    margin: 0 0.5em;
    font-size: 20px;
}
.winner {
    border: 2px solid green;
}
.loser {
    border: 2px solid red;
}
</style>
