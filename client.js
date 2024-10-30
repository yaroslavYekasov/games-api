const vue = Vue.createApp({
    data() {
        return {
            gameInModal: { id: null, name: null, price: null },
            games: [],
            newGame: { id: null, name: '', price: null },
            editMode: false,
            sortKey: '',
            sortOrder: 'asc'
        };
    },
    async created() {
        this.games = await (await fetch('http://localhost:8080/games')).json();
    },
    methods: {
        getGame: async function(id) {
            this.gameInModal = await (await fetch(`http://localhost:8080/games/${id}`)).json();
            let gameInfoModal = new bootstrap.Modal(document.getElementById('gameInfoModal'), {});
            gameInfoModal.show();
        },
        sortGames: function(key) {
            if (this.sortKey === key) {
                this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortKey = key;
                this.sortOrder = 'asc';
            }

            this.games.sort((a, b) => {
                let result = 0;
                if (a[key] < b[key]) {
                    result = -1;
                } else if (a[key] > b[key]) {
                    result = 1;
                }
                return this.sortOrder === 'asc' ? result : -result;
            });
        },
        createGame: async function() {
            if (!this.newGame.name || !this.newGame.price) {
                alert("Please fill in all fields.");
                return;
            }
            const response = await fetch(`http://localhost:8080/games/${this.newGame.name}/${this.newGame.price}`, {
                method: 'POST'
            });
            if (response.ok) {
                const createdGame = await response.json();
                this.games.push(createdGame);
                this.newGame = { name: '', price: null };
                alert("Game successfully created.");
            } else if (response.status === 400) {
                alert("Invalid game data. Name and price are required.");
            } else if (response.status === 409) {
                alert("The game already exists.");
            } else {
                alert("Failed to create the game.");
            }
        },
        editGame: function(game) {
            this.newGame = { ...game };
            this.editMode = true;
        },
        updateGame: async function() {
            if (!this.newGame.name || !this.newGame.price) {
                alert("Please fill in all fields.");
                return;
            }
            const response = await fetch(`http://localhost:8080/games/${this.newGame.id}/${this.newGame.name}/${this.newGame.price}`, {
                method: 'PUT'
            });
            if (response.ok) {
                const updatedGame = await response.json();
                const index = this.games.findIndex(game => game.id === updatedGame.id);
                this.games.splice(index, 1, updatedGame);
                this.newGame = { id: null, name: '', price: null };
                this.editMode = false;
                alert("Game successfully updated.");
            } else if (response.status === 400) {
                alert("Invalid game data. Name and price are required.");
            } else if (response.status === 404) {
                alert("Game not found.");
            } else if (response.status === 409) {
                alert("A game with the same name already exists.");
            } else {
                alert("Failed to update the game.");
            }
        },
        cancelEdit: function() {
            this.newGame = { id: null, name: '', price: null };
            this.editMode = false;
        },
        deleteGame: async function(id) {
            if (!confirm("Are you sure you want to delete this game?")) {
                return;
            }
            const response = await fetch(`http://localhost:8080/games/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                this.games = this.games.filter(game => game.id !== id);
                alert("Game successfully deleted.");
            } else {
                alert("Failed to delete the game.");
            }
        }
    }
}).mount('#mainBody');