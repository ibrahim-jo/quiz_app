
let  categoys=document.getElementById('btns')
let creatbtn=document.createElement('button')
let viewQues=document.getElementById('viewQues')
 const nameCat=[
    {name:'music',cat:'music'},
    {name:'sports',cat:'sport_and_leisure'},
    {name:'history',cat:'history'},
    {name:'geography',cat:'geography'},
    {name:'science',cat:'science'},
 ]

const fetchData  = async(limit,ca) => {

   try {
     const res=await fetch(`https://the-trivia-api.com/v2/questions/?categories=${ca}&limit=${limit}`)
     const data=await res.json()
     if(data){
       saveItem(data)
       window.location.href='./testQuestion.html'
     }
   } catch (error) {
    console.log('error',error)
   }
}
// fetchData(5,cat)
//  const loadQuestions=async(cat)=>{

//      await fetchData(5,cat)
//  }


const loadQuestions=()=>{
    
        nameCat.forEach((element)=>{
          let btn=document.createElement('button')
           btn.textContent=element.name
           btn.addEventListener('click',()=>fetchData(5,element.cat))
       categoys? categoys.appendChild(btn):null
      
        })

}

const saveItem=(data)=>{

    localStorage.setItem('quiz',JSON.stringify(data))
}
const  getQuestions=()=>{
   const questions= JSON.parse(localStorage.getItem('quiz'))
   return questions
}

loadQuestions()
 //  for page questions
let numQuestions=1
let lab=document.createElement('h1')
let quecontent=document.createElement('div')
const data=getQuestions()

const viewQuestion=()=>{
    let btnext=document.createElement('button')
    btnext.textContent='Next'
     viewQues.appendChild(btnext)
     viewQues.appendChild(lab)
     const num= data.length
     question(0)
     btnext.addEventListener('click',()=>xclick(num))
   
//   question(2)
//      viewQues?viewQues.innerText=num:'noQuestion' 

}
const xclick=(num)=>{
    
   if(numQuestions<=num){
        question(numQuestions)
       lab.textContent=`${numQuestions+1} of ${num}`
       numQuestions++
   }
   else{
       lab.textContent='end'
   }
}
const question=(num)=>{
    quecontent.innerHTML=`<h3>${data[num].question.text}</h3>`
    viewQues.appendChild(quecontent)
}


if(window.location.pathname.includes('testQuestion.html')){
    viewQuestion()
}