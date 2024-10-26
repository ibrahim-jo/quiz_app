function decodeHtml(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

async function fetchQuestions(category, numQuestions) {
  const response = await fetch(
    `https://the-trivia-api.com/v2/questions?categories=${category}&limit=${numQuestions}&region=US`
  );
  const data = await response.json();

  if (!data || data.length === 0) {
    console.log("No questions found in the response.");
    return [];
  }

  return data;
}

const categories = {
  "General Knowledge": "general_knowledge",
  "Science & Nature": "science",
  Sports: "sport",
  History: "history",
  Geography: "geography",
  "Entertainment: Film": "film_and_tv",
};

const isFetchingCategory = {};

const loadQuestions = async (key) => {
  const category = categories[key];
  const quizDiv = document.getElementById("quiz");

  isFetchingCategory[category] = true;
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
  } finally {
    isFetchingCategory[category] = false;
  }
};

const questionsCont = document.getElementById("questions-Cont");
const categoryName = document.getElementById("categoryName");
const nextbtn=document.getElementById("nextbtn");
const numofQuestions=document.getElementById("numofQuestions");
const resultbtn = document.getElementById("resultbtn");
const timerElement = document.getElementById("timer");

let index=0;


function displayQuestions() {
  const questions = JSON.parse(localStorage.getItem("questions"));
  const category = localStorage.getItem("category");


  categoryName.innerHTML = `${category}`;
  numofQuestions.innerHTML=`${index+1} /10`;

  if (questions && questions.length > 0  && index < questions.length){
    
    const questionsHtml = 
    
      `
        <h3>${index+ 1}. ${decodeHtml(questions[index].question.text)}</h3>
        
        ${[...questions[index].incorrectAnswers, questions[index].correctAnswer]
          .sort(() => Math.random() - 0.5)
          .map(
            (option) => `
            <div>
              <label>
                <input type="radio" name="question-${questions[index].id}" value="${decodeHtml(option)}" 
                  onclick="checkAnswer('${decodeHtml(option)}', '${decodeHtml(questions[index].correctAnswer)}'); disableOtherOptions('question-${questions[index].id}')">
                ${decodeHtml(option)}
              </label>
            </div>
            
           `
                  )
                  .join("")}
                  ${index < 9 ? `<button id="nextbtn" onclick="nextQuestion()">Next</button>`: `<button id="nextbtn" onclick="SubmitQuestion()">Submit</button>`}
                 

            `;
    
   
    questionsCont.innerHTML = questionsHtml;
  } else {
    questionsCont.innerHTML = "No questions available.";
  }
}

if (window.location.pathname.includes("Questions.html")) {
  displayQuestions();
}



const nextQuestion=()=>{
  index++;
  displayQuestions();

}




let finshed = false;

function endQuiz() {
  questionsCont.style.display = "none"; 
  if (nextbtn) nextbtn.style.display = "none"; 
  categoryName.innerHTML = "Finished your quiz"; 
  resultbtn.style.display = "inline-block"; 
  numofQuestions.style.display="none";
    clearInterval(timer); 
  timerElement.style.display = "none"; 
}


const SubmitQuestion = () => {
  finshed = true; 
  endQuiz(); 
};

let totalTime = 1800; 
const timer = setInterval(() => {
  totalTime--;

  const minutes = Math.floor(totalTime / 60); 
  const seconds = totalTime % 60;

  timerElement.textContent = `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;

  if (totalTime <= 0 || finshed === true) {
    endQuiz();
  }
}, 1000);

function stopTimer() {
  clearInterval(timer);
}


const showResult = () => {
  window.location.href = "Result.html";
  const result = document.getElementById("result");
};

const backtohome = () => {
  window.location.href = "index.html";
};
