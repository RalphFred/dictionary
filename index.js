// ------------------------------ Theme Changer -----------------------------
const body = document.body;
let darkmode = false;
let themeCheck = document.getElementById("theme-check");

if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  body.classList.add("dark-mode");
  themeCheck.checked = true;
  darkmode = true;
} else if (window.matchMedia("prefers-color-scheme: light").matches) {
  body.classList.add("light-mode");
  themeCheck.checked = false;
  darkmode = false;
}

const changeTheme = () => {
  darkmode = !darkmode;

  if (darkmode) {
    body.classList.add("dark-mode");
    body.classList.remove("light-mode");
  } else {
    body.classList.add("light-mode");
    body.classList.remove("dark-mode");
  }

  console.log(darkmode);
};

// --------------------------------- Search ----------------------------------------
const input = document.getElementById("input");

const searchWord = () => {
  const inputvalue = input.value;
  console.log(inputvalue);

  if (inputvalue != "") {
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${inputvalue}`;

    fetchData(url);
  }
};

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchWord();
  }
});

// ------------------------------------ Fetching Data --------------------------------
const wordWrapper = document.getElementById("word--wrapper");
const meaningWrapper = document.getElementById("meaning--wrapper");
let audioUrl = ''

async function fetchData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    audioUrl = data[0].phonetics[0].audio;
    

    wordWrapper.innerHTML = `
    <div class="word">
    <h1>${data[0].word}</h1>
    <p>${data[0].phonetic}</p>
    </div>
    <div class="audio" id="audio" onclick="audioPlay()">
      <i class="fa-solid fa-play"></i>
    </div>
    `;

    const displayeMeaning = data.map(
      (word, index) => `
      <div class="partofspeech">
      <p>${word.meanings[0].partOfSpeech}</p>
      <span></span>
    </div>
    <div class="meaning">
      <h3>Meaning</h3>

      <ul>
        <li><span>${word.meanings[0].definitions[0].definition}</span>

        ${word.meanings[0].definitions[0].synonyms != '' ? `<div class="synonyms">
        <span>Synonyms: </span> ${word.meanings[0].definitions[0].synonyms.join(', ')}
      </div>` : ''}

        ${word.meanings[0].definitions[0].antonyms != '' ? `<div class="antonyms">
        <span>Antonyms: </span> ${word.meanings[0].definitions[0].antonyms.join(', ')}
      </div>` : ''}

        ${word.meanings[0].definitions[0].example ? `<div class="sentence">
        ${word.meanings[0].definitions[0].example}
      </div>` : ''}
        </li>
      </ul>
    </div>
      `
    );

    meaningWrapper.innerHTML = displayeMeaning.join("");
  } catch (error) {
    console.log(error);
  }
}

const audioPlay = () => {
  const audio = new Audio(audioUrl)
  audio.play();
}
