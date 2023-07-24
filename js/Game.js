

class ObjectClickerGame {
    constructor(gameDuration, updateInterval, imagePaths) {

        /**
         * game duration in second
         */
        this.gameDuration = gameDuration;
        /**
         * time in second between image appearances
         */

        this.updateInterval = updateInterval;

        /**
         * array with links to images to be displayed
         */
        this.imagePaths = imagePaths;

        /**
         * Game window.
         * @type {HTMLElement}
         */
        this.gameArea = document.getElementById("gameArea");

        /**
         * Basic game elements.
         * @type {Element}
         */
        this.object = document.querySelector(".object");

        /**
         * Points scored per game.
         * @type {number}
         */
        this.score = 0;

        /**
         * Maximum scores for all games.
         * @type {number|number}
         */
        this.record = this.getRecordFromLocalStorage() || 0;

        /**
         * Timer for one game.
         */
        this.timer = this.gameDuration;

        this.gameStarted = false;

        /**
         * setInterval() var for timer
         */
        this.gameInterval = null;

        /**
         * setInterval() var for object rewriting
         */
        this.objectInterval = null;

        /**
         * When clicked : start the game and hide unnecessary element from display when button clicked.
         */
        document.getElementById("start-game-button").addEventListener("click", () => {
            this.hideMessage();
            this.hideButton();
            this.startGame();
        });

        /**
         * When user clicked on object score grow for 1 point; supports correct rendering of objects.
         */
        this.object.addEventListener("click", () => {
            if (this.object.style.display !== "none") {
                this.score++;
                this.object.style.display = "none";
                this.updateScore();
                this.restartObjectInterval()
            }
        });
    }

    /**
     * The startGame() method starts a new game.
     * It initializes all necessary variables and intervals,
     * to start a new game session.
     */
    startGame() {
        this.score = 0;
        this.timer = this.gameDuration;
        this.updateScore();
        this.restartObjectInterval()
        this.updateInGameTimer();
        this.gameStarted = true;
        this.gameInterval = setInterval(this.updateTime.bind(this), 1000);
    }

    /**
     * The moveObject() method is responsible for moving an object on the game screen.
     * It is called every time you want to move an object.
     * In this implementation, the method simply calls the showObject() method,
     * which causes the new object to be displayed at random coordinates.
     * If the game is not running (the gameStarted flag is false), the object will not be moved.
     */
    moveObject() {
        if (this.gameStarted) {
            this.showObject();
        }
    }

    /**
     * The restartObjectInterval() method is responsible for restarting the object interval.
     * It clears the previous object interval using clearInterval(),
     * then displays a new object on the game screen using showObject() method,
     * and finally sets a new interval for moving the object using setInterval().
     * This method is used to update the object's position on the screen and continue its movement.
     */
    restartObjectInterval() {
        clearInterval(this.objectInterval);
        this.showObject();
        this.objectInterval = setInterval(this.moveObject.bind(this), this.updateInterval * 1000);
    }


    /**
     * Decreases the game time and updates the in-game timer.
     */
    updateTime() {
        this.timer--;
        this.updateInGameTimer();
        if (this.timer <= 0) {
            this.endGame();
        }
    }

    /**
     * The updateInGameTimer() method updates the game timer display on the game screen.
     * It sets the text content of the element with id "timer" equal to the current timer value.
     * Thus, each time this method is called, the display of the remaining time in the game will be updated.
     */
    updateInGameTimer() {
        document.getElementById("timer").innerText = `Оставшееся время: ${this.timer} sec`;
    }

    /**
     * Clear all intervals, remove an object from the screen, display an end-of-game message,
     * add a button to the screen.
     */
    endGame() {
        clearInterval(this.gameInterval);
        clearInterval(this.updateInterval);
        this.gameStarted = false;
        this.object.style.display = "none";
        if (this.score > this.record) {
            this.record = this.score;
            this.updateRecordInLocalStorage(this.record);
            this.showMassage("Вы поставили новый рекорд!");
        } else {
            this.showMassage("Предыдущий рекорд не побит");
        }
        this.showButton();
    }

    /**
     * Display random image in random coordinates.
     */
    showObject() {
        this.object.style.display = "block";
        const pos = this.generateRandomPosition();
        const randomImagePath = this.generateRandomVisual();
        this.object.style.left = `${pos.x}px`;
        this.object.style.top = `${pos.y}px`;
        this.object.style.background = `url(${randomImagePath})`;
    }

    /**
     * generate random x and y coordinate where picture will be displayed
     *
     * @returns {{x: number, y: number}}
     */
    generateRandomPosition() {
        const rect = this.gameArea.getBoundingClientRect();
        const maxX = rect.width - this.object.offsetWidth;
        const maxY = rect.height - this.object.offsetHeight;
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);
        return {x: randomX, y: randomY};
    }

    /**
     * randomly selects one of the paths to the pictures.
     * @returns {string} file location
     */
    generateRandomVisual() {
        const randomIndex = Math.floor(Math.random() * this.imagePaths.length);
        return this.imagePaths[randomIndex];
    }

    /**
     * display in-game score label
     */
    updateScore() {
        document.getElementById("score").innerText = `Счёт: ${this.score}`;
    }

    /**
     * add a button to the screen
     */
    showButton() {
        const startButton = document.getElementById("start-game-button");
        startButton.innerText = "Попробовать снова";
        startButton.style.display = "block";
    }

    /**
     * remove button from the screen
     */
    hideButton() {
        const startButton = document.getElementById("start-game-button");
        startButton.style.display = "none";
    }

    /**
     * message display
     * @param message that will be displayed on the screen
     */
    showMassage(message) {
        const messageContainer = document.getElementById("messageContainer");
        messageContainer.innerText = message;
        messageContainer.style.display = "block";
    }

    /**
     * clears the message from the screen
     */
    hideMessage() {
        const messageContainer = document.getElementById("messageContainer");
        messageContainer.style.display = "none";
    }

    /**
     * Retrieves the maximum record from the browser's local storage.
     * @returns {number} The maximum record value, or 0 if no record is found.
     */
    getRecordFromLocalStorage() {
        return parseInt(localStorage.getItem("record"));
    }

    /**
     * Updates the maximum record in the browser's local storage with the new record value.
     * @param {number} newRecord - The new record value to be saved.
     */
    updateRecordInLocalStorage(newRecord) {
        localStorage.setItem("record", newRecord.toLocaleString());
    }

}

new ObjectClickerGame(10, 2, [
    "/img/bird.png",
    "/img/cockroach.png",
    "/img/mice.png",
    "/img/mole.png",
]);
