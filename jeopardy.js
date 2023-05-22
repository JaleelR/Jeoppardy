// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

const $spinner = $("#spin-container");
$spinner.hide();
const row = 5;
const col = 6;
/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

//why doesnt it work if i make a new set in category id's? 
//to get all ids you want to loop through each category object and get the id
//if you use a for loop it will take longer to get details, maps is faster.
//Map() creates a new array populated with a certain function being pervided for every element in array 


//randomCat is used to select a random id for categories of jeopardy game
//uses new Set to get numbers with all unique elements for no duplicates for jeopardy 
//uses math.floor and math random to select between 0-101
//use spread operater to put into an array 
function randomCat(categories) {
let idFound = new Set();
   while (idFound.size < 6){
    const id = (Math.floor(Math.random() * 101));
      idFound.add(id);
     
  }
    return [...idFound];
};


//gets the categories for jeopardy.
//loops through each category and returns the id of each
async function getCategoryIds() {
const res = await axios.get('https://jservice.io/api/categories',{params: {count : 100}});
const cat = res.data;
const id = cat.map((v,i) => cat[i].id);
const catIds = randomCat(id);
catIds.length >= 7 ? catIds : randomCat(id);
console.log(catIds);
return catIds;

}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */


 /*async function getCategory(catId) {
  //for (let catIds of catId){
   const res = await axios.get("http://jservice.io/api/category", {params: {id : catId}});
   const info = res.data; 
console.log
 //}

getCategory(66)*/

//the random Question creates a new set, while random questions are less than 5, and there are clues in the clues array,
//get a random index from from the clues length. next add that random clue to the questions object 
//splice the index to make sure it isnt choosen again 
function randomQuestion(clues){
  let questions = new Set();
  while (questions.size < 5 && clues.length > 0){
    const randomIndex = Math.floor(Math.random() * clues.length);
    const randomClue = clues[randomIndex];
    questions.add(randomClue);
    clues.splice(randomIndex, 1);
  }
  return [...questions];
};







//you want to take each id from getcategoryIds and loop through them to get the the title and clue

//getting the category info(title & clues) from API 

async function getCategory(catId) {
const res = await axios.get("https://jservice.io/api/category", {params: {id : catId}});
//const newInfo = res.data;
let newInfo = [];
     while(newInfo.length < 6){
       newInfo = [...res.data.filter(v => v.clues.length >= 5)];

 }
console.log(newInfo);
const idInfo = newInfo.map((v,i) => 
 { return {title: v.title, 
  clues: randomQuestion(v.clues).map((v,i) => { 
     return { 
      question: v.question,
      answer: v.answer, 
      showing: null
    } 
  })
  } 
})
    
    //idInfo.filter(v => v.clues.length >= 5);

    console.log(idInfo);
    return idInfo;
  };




/* Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

//the table wont be visible untill you add css to it 
//dont forget to add class to each element in table 
//easier if i just did a th
//



 


// Number of questions per category

// Fill the HTML table with categories & cells for questions
async function fillTable(getCatInfo) {
   const NUM_QUESTIONS_PER_CAT = 5;

  const $table = $('#jeopardy');
  const $head = $('<thead>').appendTo($table);
  const $tbody = $('<tbody>').appendTo($table);

  // Create header row with a <td> for each category title
  const $headerRow = $('<tr>').appendTo($head);
  getCatInfo.forEach(v => {
    const $catCell = $('<td>').addClass('table').text(v.title);
    $headerRow.append($catCell);
  });

  // Create rows with a <td> for each question for each category
  for (let i = 0; i < NUM_QUESTIONS_PER_CAT; i++) {
    const $row = $('<tr>').addClass('table').appendTo($tbody);
    getCatInfo.forEach(({ clues }) => {
      const { question, answer, showing } = clues[i];
      const $cell = $('<td>').addClass('table').text('?');
      $cell.data({ question, answer, showing }); // Save question and answer as data on the cell
      $row.append($cell);
      $cell.on('click', handleClick);
    }); 
    //const $rowRestart = $('<tr>').appendTo($tbody);

  }
}

// async function test(){
//   let catId = await getCategoryIds();
//    let catInfo = await getCategory(catId);
//  fillTable(catInfo);
//   }
//   test();
/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
const $cell = $(evt.target);
const showing = $cell.data('showing');
const question = $cell.data('question');
const answer = $cell.data('answer');
if(showing === null){
   $cell.text(question); 
   $cell.data('showing', 'question')
  } 
  else if(showing === 'question'){
 $cell.text(answer);
 $cell.data('showing', 'answer');
  } 
  else if (showing === 'answer'){
  $cell.off("click");
  }
 
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
$("#jeopardy").empty();
setupAndStart();
$spinner.css('display', 'block');


}
/** Remove the loading pinner and update the button used to fetch data. */

function hideLoadingView() {
$spinner.hide();
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
  let catId = await getCategoryIds();
  let catInfo = await getCategory(catId); 
  fillTable(catInfo);
}

function restart(){
/** On click of start / restart button, set up game. */
const $button = $('#start');
const $end = $("#end")
$button.on("click", function() {
  hideLoadingView();
  setupAndStart();
  $button.hide();
 const $restart = $('<button>');
 $restart.text("restart");
$restart.appendTo($end);
$restart.on("click", function(){
showLoadingView();
hideLoadingView();
})
})
};
restart();
// TODO

