<template>
    <div
        class="swipe-container"
        @touchstart="setTouchStart"
        @touchend="touchEnd"
    >
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
        <label for="showSheet">Show sheet</label>
        <input
            type="checkbox"
            name="showSheet"
            id="showSheet"
            v-model="showSheet"
        />
        <div class="hello">
            <label for="logosCheck">Logos on/off</label>
            <input
                type="checkbox"
                name="logosCheck"
                id="logosCheck"
                v-model="logosCheck"
            />
            <div class="sheet-container" v-if="showSheet">
                <iframe
                    src="https://docs.google.com/spreadsheets/d/e/2PACX-1vR7LSYcoIEbdNk4pi1wKO-ZZKx8Jk67VL_p1vaWCblrZigVjnxVilUiCKF18_pkglXxV9X59B5UokIV/pubhtml?widget=true&amp;headers=false"
                ></iframe>
            </div>
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
                        <div class="mid" style="margin: 0 3px">
                            <div class="at" style="margin: 5px 0">
                                {{ ' @ ' }}
                            </div>
                            <div class="period">
                                {{
                                    game.quarter > 0 && game.clock !== 'Final'
                                        ? `Q${game.quarter}`
                                        : ''
                                }}
                            </div>
                            <div class="clock">{{ game.clock }}</div>
                        </div>
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
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import apiService from '../services/apiService';
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
            showSheet: true,
            touchStart: 0,
        };
    },
    methods: {
        setTouchStart(evt) {
            this.touchStart = 0;
            this.touchStart = evt.changedTouches[0].clientX;
        },
        touchEnd(evt) {
            const position = evt.changedTouches[0].clientX;
            if (
                position > this.touchStart &&
                position - this.touchStart > 200
            ) {
                this.changeWeek('down');
            }
            if (
                position < this.touchStart &&
                this.touchStart - position > 200
            ) {
                this.changeWeek('up');
            }
        },
        changeWeek(upOrDown: string) {
            switch (upOrDown) {
                case 'up':
                    if (this.weekSelect <= 17) {
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
            console.log(apiData);
            const transformedGames = apiData.events.map((e) => {
                const gameDate = new Date(e.date);
                const homeCompetitor = e.competitions[0].competitors.find(
                    (c: { homeAway: string }) => c.homeAway === 'home'
                );
                const awayCompetitor = e.competitions[0].competitors.find(
                    (c: { homeAway: string }) => c.homeAway === 'away'
                );
                let homeScore = 0;
                let awayScore = 0;

                let clock;
                if (e.competitions[0].status.type.completed) {
                    clock = 'Final';
                } else if (e.competitions[0].status.type.id === '1') {
                    clock = '';
                } else {
                    clock = e.competitions[0].status.displayClock;
                }

                if (homeCompetitor.linescores) {
                    homeCompetitor.linescores.forEach((ls) => {
                        homeScore += ls.value;
                    });
                }

                if (awayCompetitor.linescores) {
                    awayCompetitor.linescores.forEach((ls) => {
                        awayScore += ls.value;
                    });
                }

                const gameObj = {
                    id: e.id,
                    clock,
                    quarter:
                        e.competitions[0].status.type.id !== '1'
                            ? e.competitions[0].status.period
                            : '',
                    dateObj: gameDate,
                    date: `${gameDate.toLocaleString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                    })} | ${gameDate.toLocaleTimeString('en-US', {
                        timeZone: 'America/Chicago',
                        timeZoneName: 'short',
                    })}`,
                    venue: e.competitions[0].venue.fullName,
                    homeTeam: homeCompetitor.team,
                    homeScore,
                    awayScore,
                    awayTeam: awayCompetitor.team,
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
            this.games = transformedGames.sort((a, b) => {
                let c = a.dateObj.getTime();
                let d = b.dateObj.getTime();
                return c > d ? 1 : -1;
            });
            this.week = apiData.week.number;
        },
        async refreshList(selectedWeek: number) {
            if (
                selectedWeek >= 1 &&
                selectedWeek < 19 &&
                selectedWeek !== this.week
            ) {
                this.getList(selectedWeek);
            }
        },
    },
    async created() {
        const apiGames: any = await apiService.getAllGames(1);
        const calendar = apiGames.leagues[0].calendar[1].entries;
        let currentDate = new Date();
        const weeks = calendar.map((e) => {
            return { endDate: new Date(e.endDate), week: e.value };
        });
        for (const week of weeks) {
            if (currentDate < week.endDate) {
                this.weekSelect = week.week;
                this.getList(week.week);
                return;
            }
        }
        this.getList(1);
    },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
iframe {
    height: 300px;
    width: 700px;
    resize: both;
    overflow: auto;
}
.swipe-container {
    z-index: 9999;
}
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
    margin: 1em auto;
    padding-top: 1em;
    max-width: 900px;
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
.winner,
.loser {
    border-radius: 7px;
}
.winner {
    background-color: #93c47d;
}
.loser {
    background-color: #e06666;
}
.print {
    margin-bottom: 0.5em;
    padding-bottom: 0.5em;
}
main {
    width: 100%;
}
@media screen and (max-width: 700px) {
    .at {
        font-size: 12px;
    }
}
</style>
