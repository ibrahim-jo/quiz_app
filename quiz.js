function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

async function fetchQuestions(category, numQuestions) {
    const response = await fetch(`https://the-trivia-api.com/v2/questions?categories=${category}&limit=${numQuestions}&region=US`);
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
    "Sports": "sport",
    "History": "history",
    "Geography": "geography",
    "Entertainment: Film": "film_and_tv"
};

const isFetchingCategory = {};

const loadQuestions = async (key) => {
    const category = categories[key];
    const quizDiv = document.getElementById('quiz');

    isFetchingCategory[category] = true;
    quizDiv.innerHTML = "Loading questions...";

    try {
        const questions = await fetchQuestions(category, 15);
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
const categoryName=document.getElementById("categoryName");


function displayQuestions() {
    const questions = JSON.parse(localStorage.getItem("questions"));
    const category = localStorage.getItem("category");

    categoryName.innerHTML=`Questions for ${category}`;

    

    if (questions && questions.length > 0) {
        
        const questionsHtml = questions.map(ques => {
            return `
              <h3>${decodeHtml(ques.question.text)}</h3>
              <ul>
                ${[...ques.incorrectAnswers, ques.correctAnswer]
                  .sort(() => Math.random() - 0.5)
                  .map(option => `<li>${decodeHtml(option)}</li>`)
                  .join("")}
              </ul>
            `;
        }).join("");

        questionsCont.innerHTML = questionsHtml;
    } else {
        questionsCont.innerHTML = "No questions available.";
    }
}


if (window.location.pathname.includes("Questions.html")) {
    displayQuestions();
}


// timer
const resultbtn=document.getElementById("resultbtn");
    let totalTime = 30; 
    const timerElement = document.getElementById('timer');

    const timer = setInterval(() => {
      totalTime--;

      
      timerElement.textContent =  `Time left: ${totalTime}s`;

      if (totalTime <= 0) {
        clearInterval(timer);
  
        questionsCont.style.display="none";
        categoryName.innerHTML="fineshed your quiz";
        resultbtn.style.display="inline-block";
    }
    }, 1000); 

    function stopTimer() {
      clearInterval(timer);
    }
  

const showResult=()=>{
    window.location.href = "Result.html"; 
    const result=document.getElementById("result");
}