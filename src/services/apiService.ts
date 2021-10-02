import axios from 'axios';

const apiUrl = 'http://site.api.espn.com/apis/site/v2/sports/football/nfl';

const apiClient = axios.create({
    baseURL: apiUrl,
});

class ApiService {
    async getAllGames(week: number) {
        const response = await apiClient.get(`/scoreboard?week=${week}`);
        console.log(response.data);
        return response.data;
    }

    async getAllTeams() {
        const response = await apiClient.get('/teams');
        return response.data;
    }
}

export default new ApiService();
