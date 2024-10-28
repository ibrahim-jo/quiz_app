async function fetchQuestions(category, numQuestions) {
  try {
    const response = await fetch(
      `https://the-trivia-api.com/v2/questions?categories=${category}&limit=${numQuestions}&region=US`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      console.log("No questions found in the response.");
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return []; 
  }
}

const categories = {
  "General Knowledge": "general_knowledge",
  "Science & Nature": "science",
  Sports: "sport",
  History: "history",
  Geography: "geography",
  Technology: "technology",
};


const loadQuestions = async (key) => {
  const category = categories[key];
  const quizDiv = document.getElementById("quiz");

  quizDiv.innerHTML = "Loading questions...";

  try {
    const questions = await fetchQuestions(category, 10);
    quizDiv.innerHTML = "";

    if (questions && questions.length > 0) {
      localStorage.setItem("questions", JSON.stringify(questions));
      localStorage.setItem("category", key);

      window.location.href = "Questions.html";
    } else {
      quizDiv.innerHTML = "No questions available.";
    }
  } catch (error) {
    quizDiv.innerHTML = "Error fetching questions.";
    console.error("Error fetching questions:", error);
  } 
};

const questionsCont = document.getElementById("questions-Cont");
const categoryName = document.getElementById("categoryName");
const numofQuestions = document.getElementById("numofQuestions");

let index = 0;
let numberofcorrect = 0; 
const userAnswers = [];

function displayQuestions() {
  const questions = JSON.parse(localStorage.getItem("questions"));
  const category = localStorage.getItem("category");

  categoryName.innerHTML = `${category} Quiz`;
  
  numofQuestions.innerHTML = `${index + 1} / 10`;

  if (questions && index < questions.length) {
    const questionsHtml = `
      <h3>${index + 1}. ${questions[index].question.text}</h3>
      
      ${[...questions[index].incorrectAnswers, questions[index].correctAnswer]
        .sort(() => Math.random() - 0.5)
        .map((option) => `
          <div>
            <label>
              <input type="radio" name="question-${questions[index].id}" value="${option}" 
                onclick="checkAnswer('${option}', '${questions[index].correctAnswer}', ${index})">
              ${option}
            </label>
          </div>
        `).join("")}
      
      ${index < 9 ? `<button id="nextbtn" onclick="nextQuestion()">Next</button>` : `<button id="nextbtn" onclick="endQuiz()">Submit</button>`}
    `;

    questionsCont.innerHTML = questionsHtml;
  } else {
    questionsCont.innerHTML = "No questions available.";
  }
}

if (window.location.pathname.includes("Questions.html")) {
  displayQuestions();
}

const nextQuestion = () => {
  index++;
  displayQuestions();
};

const checkAnswer = (option, correct, questionIndex) => {
  userAnswers[questionIndex] = option;

  if (option === correct) {
    numberofcorrect++;
  } else if (userAnswers[questionIndex] === correct) {
    numberofcorrect--; 
  }
console.log(correct);
  localStorage.setItem("numcorrect", numberofcorrect); 
};

let timer; 

const clearTimer = () => {
  clearInterval(timer);
};

function endQuiz() {
  clearTimer(); 
  localStorage.setItem("numberOfCorrectAnswers", numberofcorrect);
  window.location.href = "Result.html";
}

if (window.location.pathname.includes("Result.html")) {
  const resultElement = document.getElementById("result");
  const numberOfCorrectAnswers = localStorage.getItem("numberOfCorrectAnswers");

  resultElement.innerHTML = `${numberOfCorrectAnswers} / 10`; 
  localStorage.removeItem("numberOfCorrectAnswers");
}

const backtohome = () => {
  window.location.href = "index.html";
};

if (window.location.pathname.includes("Questions.html")) {
  const timerElement = document.getElementById("timer");
  let totalTime = 50;

  timer = setInterval(() => {
    totalTime--;

    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;

    timerElement.textContent = `${minutes}m ${seconds < 10 ? "0" : ""}${seconds}s`;

    if (totalTime <= 0) {
      clearTimer(); 
      endQuiz();
    }
  }, 1000);
}
