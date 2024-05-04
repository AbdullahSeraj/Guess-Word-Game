// Setting Game Name
let gameName = "Guess Word Game";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector(
  "footer"
).innerHTML = `${gameName} Game Created By <span>SERAJ ALDDIN</span>`;

// Setting Game Options
let numberOfTries = 5;
let numberOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;

// Manage Words
let wordToGuess = "";
const words = [
  "Create",
  "Update",
  "Delete",
  "Master",
  "Branch",
  "Mainly",
  "School",
  "Animal",
  "Amount",
  "Couple",
];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
let messageArea = document.querySelector(".message");

// Manage Hints
document.querySelector('.hint span').innerHTML = numberOfHints;
const getHintButton = document.querySelector('.hint');
getHintButton.addEventListener('click', getHint);

function generateInput() {
  const inputsContainer = document.querySelector(".inputs");

  // Create Main Try Div
  for (let i = 1; i <= numberOfTries; i++) {
    let tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i}</span>`;

    if (i !== 1) tryDiv.classList.add("disable-inputs");

    // Create Inputs
    for (let j = 1; j <= numberOfLetters; j++) {
      let input = document.createElement("input");
      input.type = "text";
      input.setAttribute("maxLength", "1");
      input.id = `guess-${i}-letter-${j}`;
      tryDiv.appendChild(input);
    }
    inputsContainer.appendChild(tryDiv);
  }
  inputsContainer.children[0].children[1].focus();

  // Disable All Inputs Except Fist One
  const inputsInDisabledDiv = document.querySelectorAll(".disable-inputs input");
  inputsInDisabledDiv.forEach((input) => (input.disabled = true));

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
      let nextInput = inputs[index + 1];
      if (nextInput) nextInput.focus();
    });

    input.addEventListener("keydown", function (event) {
      const currentIndex = Array.from(inputs).indexOf(event.target);
      if (event.key == "ArrowRight") {
        const nextInput = currentIndex + 1;
        if (inputs.length > nextInput) inputs[nextInput].focus();
      }
      if (event.key == "ArrowLeft") {
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) inputs[prevIndex].focus();
      }
    });
  });
}

const guessBtn = document.querySelector(".check");
guessBtn.addEventListener("click", handleGuesses);

console.log(wordToGuess);
function handleGuesses() {
  let successGuess = true;
  for (let i = 1; i <= numberOfLetters; i++) {
    const inputField = document.querySelector(
      `#guess-${currentTry}-letter-${i}`
    );
    const letter = inputField.value.toLowerCase();
    const actualLetter = wordToGuess[i - 1];

    // Game Logic
    if (actualLetter === letter) {
      inputField.classList.add("in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      inputField.classList.add("not-in-place");
      successGuess = false;
    } else {
      inputField.classList.add("no");
      successGuess = false;
    }
  }

  if (successGuess) {
    messageArea.innerHTML = `You Win The Word Is <span>${wordToGuess}</span>`;

    if (numberOfHints === 2) {
      messageArea.innerHTML += `<p>Congratz You Didn't Use Hints</p>`;
    }

    let allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((input) => input.classList.add("disable-inputs"));

    guessBtn.classList.add('disable')
    guessBtn.disabled = true;
    getHintButton.disabled = true;

  } else {
    document.querySelector(`.try-${currentTry}`).classList.add("disable-inputs");
    const currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
    currentTryInputs.forEach((input) => (input.disabled = true))
    currentTry++;

    if (currentTry <= numberOfTries) {
      document.querySelector(`.try-${currentTry}`).classList.remove("disable-inputs");
      const nextInputTry = document.querySelectorAll(`.try-${currentTry} input`);
      nextInputTry.forEach((input) => (input.disabled = false));
      nextInputTry[0].focus();

    } else {
      messageArea.innerHTML = `You Loss The Word Is <span>${wordToGuess}</span>`;
      guessBtn.classList.add('disable');
      guessBtn.disabled = true;
      getHintButton.disabled = true;
    }


  }
}

document.addEventListener("keydown", function (event) {
  if (event.key === 'Enter') {
    handleGuesses();
  }
  if (event.key === 'Backspace') {
    const inputs = document.querySelectorAll('input:not([disable])');
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);
    if (currentIndex > 0) {
      const currentInput = inputs[currentIndex];
      const prevInput = inputs[currentIndex - 1];
      currentInput.value = '';
      prevInput.value = '';
      prevInput.focus();
    }
  }
});

function getHint() {
  if (numberOfHints > 0) {
    numberOfHints--;
    document.querySelector('.hint span').innerHTML = numberOfHints;
  }
  if (numberOfHints === 0) {
    getHintButton.disabled = true;
  }

  const enabledInputs = document.querySelectorAll('input:not([disabled])');
  const emptyEnabledInputs = Array.from(enabledInputs).filter((input) => input.value === '');

  if (emptyEnabledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
    const randomEmptyEnabledInputs = emptyEnabledInputs[randomIndex];
    const indexToFill = Array.from(enabledInputs).indexOf(randomEmptyEnabledInputs);

    if (indexToFill !== -1) {
      randomEmptyEnabledInputs.value = wordToGuess[indexToFill].toUpperCase();
    }
  }
}

window.onload = function () {
  generateInput();
};
