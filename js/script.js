//Randbetween function
function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Function to restore all defaults
function readyToStartUpdate() {
  currentAvaliableRanks[20] = 1;
  for (let i = 19; i > 6; i--) {
    currentAvaliableRanks[i] = currentAvaliableRanks[i + 1] * 3;
  }
  for (let i = 6; i > 0; i--) {
    currentAvaliableRanks[i] = currentAvaliableRanks[i + 1] * 2;
  }
  for (let i = 1; i <= 20; i++) {
    currentResultedRanks[i] = { rank: ranks[i - 1], count: 0 };
  }
  currentAttempts = 1;
}

// Define the game states using an enum-like object
const GameState = Object.freeze({
  READY_TO_START: "READY_TO_START",
  END_OF_GAME: "END_OF_GAME",
});

//Ranks list
const ranks = [
  "Рядовой",
  "Ефрейтор",
  "Мл. Сержант",
  "Сержант",
  "Ст. Сержант",
  "Старшина",
  "Прапорщик",
  "Ст. Прапорщик",
  "Мл. Лейтенант",
  "Лейтенант",
  "Ст. Лейтенант",
  "Капитан",
  "Майор",
  "Подполковник",
  "Полковник",
  "Генерал-Майор",
  "Генерал-Лейтенант",
  "Генерал-Полковник",
  "Генерал Армии",
  "Маршал",
];

// Initialize the game state to READY_TO_START
let currentState = GameState.READY_TO_START;

// Initialize game variables
const currentAvaliableRanks = {
  generateLeftover() {
    let leftover = 0;
    for (let i = 1; i <= 20; i++) {
      leftover += this[i];
    }
    return leftover;
  },
  generateRank(number) {
    let currentRank = 1;
    let currentSum = this[currentRank];
    while (currentSum < number) {
      currentRank += 1;
      currentSum += this[currentRank];
    }
    this[currentRank] -= 1;
    return currentRank;
  },
};
const currentResultedRanks = {
  addRank(rank) {
    this[rank]["count"] += 1;
  },
};
let currentAttempts = 1;

// Get references to buttons, status, and playing info
const restartButton = document.getElementById("restart");
const startButton = document.getElementById("start");
const playerGrid = document.querySelector(".player-grid");
const userInput = document.getElementById("user-input");
const inputLabel = document.getElementById("input-label");
const statusText = document.querySelector("#status p");
// Update the game status based on the current state
function updateGameStatus() {
  switch (currentState) {
    case GameState.READY_TO_START:
      readyToStartUpdate();
      restartButton.disabled = true;
      startButton.disabled = false;
      userInput.classList.remove("hidden");
      playerGrid.classList.add("hidden");
      inputLabel.classList.remove("hidden");
      statusText.classList.remove("p-no-border");
      statusText.textContent = "Press Start to begin.";
      break;
    case GameState.END_OF_GAME:
      restartButton.disabled = false;
      startButton.disabled = true;
      userInput.classList.add("hidden");
      playerGrid.classList.remove("hidden");
      inputLabel.classList.add("hidden");
      statusText.classList.add("p-no-border");
      statusText.textContent = `Here are your results for ${currentAttempts.toLocaleString()} attempts.`;
      break;
  }
}

//Input number format validation
function validateAndFormatInput(event) {
  const input = event.target; // Get the input element
  const value = input.value.replace(/,/g, ""); // Remove any commas from the input

  // Check if the value is a valid integer and within range
  const parsedValue = parseInt(value, 10);
  if (
    !Number.isInteger(parsedValue) ||
    parsedValue < 1 ||
    parsedValue > 203276182
  ) {
    input.value = ""; // Clear the input if it's invalid
    alert("Please enter a valid integer between 1 and 203,276,182.");
    return;
  }

  // Format the value with thousand separators
  input.value = parsedValue.toLocaleString();
}

//Add event listener to format and assert userInput
userInput.addEventListener("change", validateAndFormatInput);

startButton.addEventListener("click", function () {
  // Your code to handle the start button click event
  currentState = GameState.END_OF_GAME;
  currentAttempts = Number(userInput.value.replace(/,/g, ""));
  calculateRanks();
  updateGameStatus();
  updateGrid();
});

restartButton.addEventListener("click", function () {
  // Your code to handle the restart button click event
  currentState = GameState.READY_TO_START;
  updateGameStatus();
});

function calculateRanks() {
  for (let i = 1; i <= currentAttempts; i++) {
    const randomRank = currentAvaliableRanks.generateRank(
      randBetween(1, currentAvaliableRanks.generateLeftover())
    );
    currentResultedRanks.addRank(randomRank);
  }
}

function updateGrid() {
  const existingItems = playerGrid.querySelectorAll(".grid-item");
  existingItems.forEach((item) => item.remove());

  for (let i = 1; i <= 20; i++) {
    const rankCell = document.createElement("div");
    rankCell.className = "grid-item";
    rankCell.textContent = currentResultedRanks[i]["rank"];
    const countCell = document.createElement("div");
    countCell.className = "grid-item";
    countCell.textContent = currentResultedRanks[i]["count"].toLocaleString();

    playerGrid.appendChild(rankCell);
    playerGrid.appendChild(countCell);
  }
}

// Initial state update
updateGameStatus();
