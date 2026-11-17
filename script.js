const questions = [
  "Your friend becomes successful and starts pushing you to work harder because they don't want you to fall behind.",

  "A family member hides the truth about something important because they believe they're protecting you.",

  "Your partner encourages you to turn down a job abroad because they want to build a future together.",

  "A lecturer gives you extra opportunities because they believe you have more potential than the rest of the class.",

  "A stranger tells you to stay away from someone you trust, but you have no idea whether they're telling the truth."
];

let currentQuestion = 0;

const allResults = [];

const questionText = document.getElementById("questionText");
const questionNumber = document.getElementById("questionNumber");
const progressBar = document.getElementById("progressBar");

const greenVotes = document.getElementById("greenVotes");
const redVotes = document.getElementById("redVotes");

const greenPercentage = document.getElementById("greenPercentage");
const redPercentage = document.getElementById("redPercentage");

const greenBar = document.getElementById("greenBar");
const redBar = document.getElementById("redBar");

const totalVotes = document.getElementById("totalVotes");
const resultMessage = document.getElementById("resultMessage");

const nextButton = document.getElementById("nextButton");
const resetButton = document.getElementById("resetButton");

const gameCard = document.querySelector(".game-card");
const finalScreen = document.getElementById("finalScreen");
const summaryList = document.getElementById("summaryList");

function getVotes(input) {
  const value = Number(input.value);

  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }

  return Math.floor(value);
}

function loadQuestion() {
  questionText.textContent = questions[currentQuestion];

  questionNumber.textContent =
    `QUESTION ${String(currentQuestion + 1).padStart(2, "0")} / 05`;

  progressBar.style.width =
    `${((currentQuestion + 1) / questions.length) * 100}%`;

  greenVotes.value = 0;
  redVotes.value = 0;

  updateResults();

  nextButton.textContent =
    currentQuestion === questions.length - 1
      ? "See final results →"
      : "Next question →";
}

function updateResults() {
  const green = getVotes(greenVotes);
  const red = getVotes(redVotes);

  const total = green + red;

  const greenPercent = total === 0
    ? 0
    : Math.round((green / total) * 100);

  const redPercent = total === 0
    ? 0
    : 100 - greenPercent;

  greenPercentage.textContent = `${greenPercent}%`;
  redPercentage.textContent = `${redPercent}%`;

  greenBar.style.width = `${greenPercent}%`;
  redBar.style.width = `${redPercent}%`;

  totalVotes.textContent =
    `${total} ${total === 1 ? "vote" : "votes"}`;

  if (total === 0) {
    resultMessage.textContent =
      "Enter the class votes to see the results.";
  } else if (green > red) {
    resultMessage.textContent =
      "The class verdict: GREEN FLAG wins!";
  } else if (red > green) {
    resultMessage.textContent =
      "The class verdict: RED FLAG wins!";
  } else {
    resultMessage.textContent =
      "It's a tie! The class is divided.";
  }
}

function saveCurrentResult() {
  const green = getVotes(greenVotes);
  const red = getVotes(redVotes);

  allResults[currentQuestion] = {
    question: questions[currentQuestion],
    green,
    red,
    total: green + red
  };
}

function showFinalResults() {
  gameCard.classList.add("hidden");
  finalScreen.classList.remove("hidden");

  summaryList.innerHTML = "";

  allResults.forEach((result, index) => {
    const total = result.total;

    const greenPercent = total === 0
      ? 0
      : Math.round((result.green / total) * 100);

    const redPercent = total === 0
      ? 0
      : 100 - greenPercent;

    let winner = "No votes recorded";

    if (total > 0 && result.green > result.red) {
      winner = "Green Flag wins";
    } else if (total > 0 && result.red > result.green) {
      winner = "Red Flag wins";
    } else if (total > 0) {
      winner = "It's a tie";
    }

    const item = document.createElement("div");
    item.className = "summary-item";

    const heading = document.createElement("h3");
    heading.textContent = `${index + 1}. ${result.question}`;

    const details = document.createElement("p");
    details.textContent =
      `${winner} · Green ${greenPercent}% · Red ${redPercent}% · ${total} votes`;

    item.appendChild(heading);
    item.appendChild(details);

    summaryList.appendChild(item);
  });
}

greenVotes.addEventListener("input", updateResults);
redVotes.addEventListener("input", updateResults);

resetButton.addEventListener("click", () => {
  greenVotes.value = 0;
  redVotes.value = 0;
  updateResults();
});

nextButton.addEventListener("click", () => {
  saveCurrentResult();

  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    loadQuestion();
  } else {
    showFinalResults();
  }
});

document.getElementById("restartButton").addEventListener("click", () => {
  currentQuestion = 0;
  allResults.length = 0;

  finalScreen.classList.add("hidden");
  gameCard.classList.remove("hidden");

  loadQuestion();
});

loadQuestion();
