const slider = document.getElementById("password-length");
const sliderBubble = document.getElementById("slider-bubble");
const upperEl = document.getElementById("upper");
const lowerEl = document.getElementById("lower");
const symbolsEl = document.getElementById("symbols");
const numbersEl = document.getElementById("numbers");
const passwordBoxEl = document.getElementById("password-box");
const copyBtnEl = document.getElementById("copy-btn");
const refreshBtnEl = document.getElementById("refresh-btn");
const passwordLists = document.getElementById("password-lists");
const clearBtnEl = document.getElementById("clear-btn");
const copiedTextEl = document.getElementById("copied-text");
const copyIconEl = document.querySelectorAll("#copy-icon");
const checkedAlways = document.querySelectorAll(".checked-always");

let passwords = JSON.parse(localStorage.getItem("password-history")) || [];

checkPasswordHistoryLength();
renderHistoryUI();
updateBubble();
generatePassword();

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

//! Display the clear button only if password length is above 5
function checkPasswordHistoryLength() {
  if (passwords.length < 5) {
    clearBtnEl.style.display = "none";
  } else {
    clearBtnEl.style.display = "block";
  }
}

function renderHistoryUI() {
  let htmlElement = "";

  passwords.forEach((pass) => {
    htmlElement += `
     <li>
          <p>${escapeHtml(pass)}</p>
          <button class="copy-icon" id="copy-icon">
            <!-- <i class="fa-solid fa-copy"></i> -->
          </button>
      </li>
    `;
  });

  passwordLists.innerHTML = htmlElement;
}

//!  MAKE THE LABEL MOVE WITH THE SLIDER
function updateBubble() {
  const value = Number(slider.value);
  const min = Number(slider.min);
  const max = Number(slider.max);
  const thumbWidth = 21;

  const ratio = (value - min) / (max - min);
  const thumbOffset = (0.5 - ratio) / thumbWidth;

  sliderBubble.textContent = value;
  sliderBubble.style.left = `calc(${ratio * 100}% + ${thumbOffset}px)`;
}

//! PREVENT UPPEREL AND LOWEREL FROM BEING UNCHECKED
checkedAlways.forEach((checkedBtns) => {
  checkedBtns.checked = true;

  checkedBtns.addEventListener("click", (e) => {
    if (!e.target.checked) {
      e.preventDefault();
    }
  });
});

//! GENERATE A RANDOM PASSWORD AND RENDER IT INTO THE PASSWORD BOX
function generatePassword() {
  const characters = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];

  const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  const symbols = [
    "!",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "(",
    ")",
    "-",
    "_",
    "=",
    "+",
    "[",
    "]",
    "{",
    "}",
    ";",
    ":",
    ",",
    ".",
    "<",
    ">",
    "/",
    "?",
    "~",
    "`",
    "|",
  ];

  let combinedArrays = characters;

  const value = Number(slider.value);

  if (symbolsEl.checked && numbersEl.checked) {
    combinedArrays = characters.concat(numbers, symbols);
  } else if (symbolsEl.checked) {
    combinedArrays = characters.concat(symbols);
  } else if (numbersEl.checked) {
    combinedArrays = characters.concat(numbers);
  }

  let password = "";

  for (let i = 0; i < value; i++) {
    const randomNumber = Math.floor(Math.random() * combinedArrays.length);
    password += combinedArrays[randomNumber];
  }

  renderPasswordHistory(password);
}

//! Render the passwords
function renderPasswordHistory(password) {
  passwordBoxEl.textContent = password;
  passwords.unshift(password);
  localStorage.setItem("password-history", JSON.stringify(passwords));
  renderHistoryUI();
  checkPasswordHistoryLength();
}

//! Clear the password history
function clearHistory() {
  passwords = [];
  localStorage.removeItem("password-history");
  passwordLists.innerHTML = "";
  clearBtnEl.style.display = "none";
}

//! Copy the password with the copy button
copyBtnEl.addEventListener("click", async () => {
  const textToCopy = passwordBoxEl.textContent.trim();

  if (!textToCopy) return;

  copiedTextEl.style.opacity = "100";

  try {
    await navigator.clipboard.writeText(textToCopy);
    copiedTextEl.textContent = "Password Copied";
  } catch (error) {
    copiedTextEl.textContent = "Failed to copy password";
  }

  setTimeout(() => {
    copiedTextEl.style.opacity = "0";
  }, 2000);
});

slider.addEventListener("input", updateBubble);
refreshBtnEl.addEventListener("click", generatePassword);
clearBtnEl.addEventListener("click", clearHistory);
