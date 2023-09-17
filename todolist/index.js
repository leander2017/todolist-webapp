import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
var todos = [];
var todosWork = [];
const currentDay = getCurrentDay();
const currentDate = getCurrentDate();
const currentWeek = getCurrentCalendarWeek();


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//Daily
app.get("/", (req, res) => {
    res.render("index.ejs",{list: todos, date: currentDay, today: currentDate, today: currentDate, today: currentDate});
});

//Work
app.get("/work", (req, res) => {
  res.render("work.ejs",{list: todosWork, date: currentWeek});
});

//Daily
app.post("/submit", (req, res) => {
  let date = new Date();
  let now = date.getTime();
  let next = req.body["todo"];
  let nextJSO = {
                  text: next, 
                  timeStamp: now, 
                  startTime: "", 
                  endTime: "", 
                  setStart: false, 
                  setEnd: false,
                  done: false,
                  temp: ""
                };
  if (todos.length > 0){
    if(todos[todos.length - 1]["setStart"] == true){
      nextJSO["startTime"] = "(" + formatTime(nextJSO["timeStamp"]) + ")";
      nextJSO["setStart"] = true;
    }
  }
  todos.push(nextJSO);
  res.render("index.ejs", {list: todos, date: currentDay, today: currentDate, today: currentDate, today: currentDate});
});

//Work
app.post("/worksubmit", (req, res) => {
  let date = new Date();
  let now = date.getTime();
  let next = req.body["todo"];
  let nextJSO = {
                 text: next, 
                 timeStamp: now, 
                 startTime: "", 
                 endTime: "", 
                 setStart: false, 
                 setEnd: false,
                 done: false,
                 temp: ""
                };
  if (todosWork.length > 0){
    if(todosWork[todosWork.length - 1]["setStart"] == true){
      nextJSO["startTime"] = "(" + formatTimeAndDay(nextJSO["timeStamp"]) + ")";
      nextJSO["setStart"] = true;
    }
  }            
  todosWork.push(nextJSO);
  res.render("work.ejs", {list: todosWork, date: currentWeek});
});

//Daily
app.post("/done", (req, res) => {
  let time = req.body["task"];
  for (let i = 0; i < todos.length; i++){
    if (time == todos[i]["timeStamp"] && todos[i]["done"] == false) {
      todos[i]["temp"] = formatTime(new Date().getTime());
      todos[i]["done"] = true;
      todos[i]["text"] = todos[i]["text"].strike();
      if (todos[i]["setStart"] == true){
        todos[i]["setEnd"] = true;
        todos[i]["startTime"] = todos[i]["startTime"].slice(0, -1) + " ";
        todos[i]["endTime"] = " - " +  formatTime(new Date().getTime()) + ")";
      }
    }
  }
  res.render("index.ejs", {list: todos, date: currentDay, today: currentDate, today: currentDate}) 
});

//Work
app.post("/doneWork", (req, res) => {
  let time = req.body["task"];
  for (let i = 0; i < todosWork.length; i++){
    if (time == todosWork[i]["timeStamp"] && todosWork[i]["done"] == false) {
      todosWork[i]["temp"] = formatTimeAndDay(new Date().getTime());
      todosWork[i]["done"] = true;
      todosWork[i]["text"] = todosWork[i]["text"].strike();
      if (todosWork[i]["setStart"] == true){
        todosWork[i]["setEnd"] = true;
        todosWork[i]["startTime"] = todosWork[i]["startTime"].slice(0, -1) + " ";
        todosWork[i]["endTime"] = " - " +  formatTimeAndDay(new Date().getTime()) + ")";
      }
    }
  }
  res.render("work.ejs", {list: todosWork, date: currentWeek}) 
});

//Daily
app.post("/undone", (req, res) => {
  let time = req.body["task"];
  for (let i = 0; i < todos.length; i++){
    if (time == todos[i]["timeStamp"]) {
      if (todos[i]["done"] == true){
         todos[i]["done"] = false;
         todos[i]["text"] = todos[i]["text"].slice(8);
      } 
      if (todos[i]["setStart"] == true){
         todos[i]["startTime"] = "(" + formatTime(todos[i]["timeStamp"]) + ")";
         todos[i]["endTime"] = "";
      }
    }
  }
  res.render("index.ejs", {list: todos, date: currentDay, today: currentDate}) 
});

//Work
app.post("/undoneWork", (req, res) => {
  let time = req.body["task"];
  for (let i = 0; i < todosWork.length; i++){
    if (time == todosWork[i]["timeStamp"]) {
      if (todosWork[i]["done"] == true){
         todosWork[i]["done"] = false;
         todosWork[i]["text"] = todosWork[i]["text"].slice(8);
      } 
      if (todosWork[i]["setStart"] == true){
         todosWork[i]["startTime"] = "(" + formatTimeAndDay(todosWork[i]["timeStamp"]) + ")";
         todosWork[i]["endTime"] = "";
      }
    }
  }
  res.render("work.ejs", {list: todosWork, date: currentWeek}) 
});

//Daily
app.post("/refreshList", (req, res) => {
  let newTodos = [];
  for (let i = 0; i < todos.length; i++){
      if (!todos[i]["done"]) {
        newTodos.push(todos[i]);
      }
  }
  todos = newTodos;
  res.render("index.ejs",{list: todos, date: currentDay, today: currentDate})
});

//Work
app.post("/refreshListWork", (req, res) => {
  let newtodosWork = [];
  for (let i = 0; i < todosWork.length; i++){
      if (!todosWork[i]["done"]) {
        newtodosWork.push(todosWork[i]);
      }
  }
  todosWork = newtodosWork;
  res.render("work.ejs",{list: todosWork, date: currentWeek})
});

//Daily
app.post("/remove", (req, res) => {
  let timeToDelete = req.body["removeButton"];
  for (let i = 0; i < todos.length; i++){
    if (timeToDelete == todos[i]["timeStamp"]) {
      todos.splice(i, 1);
    }
  }
  res.render("index.ejs", {list: todos, date: currentDay, today: currentDate})
});

//Work
app.post("/removeWork", (req, res) => {
  let timeToDelete = req.body["removeButton"];
  for (let i = 0; i < todosWork.length; i++){
    if (timeToDelete == todosWork[i]["timeStamp"]) {
      todosWork.splice(i, 1);
    }
  }
  res.render("work.ejs", {list: todosWork, date: currentWeek})
});

//Daily
app.post("/getTimeStamp", (req, res) => {
  for (let i = 0; i < todos.length; i++){
    if (!todos[i]["setStart"] && todos[i]["done"]){
        todos[i]["startTime"] += "(" + formatTime(todos[i]["timeStamp"]);
        todos[i]["setStart"] = true;
        todos[i]["endTime"] = " - " + todos[i]["temp"] + ")";
    }
    if (!todos[i]["setStart"]){
        todos[i]["startTime"] = "(" + formatTime(todos[i]["timeStamp"]) + ")";
        todos[i]["setStart"] = true;
    }
  }
  res.render("index.ejs", {list: todos, date: currentDay, today: currentDate}) 
});

//Work
app.post("/getTimeStampWork", (req, res) => {
  for (let i = 0; i < todosWork.length; i++){
    if (!todosWork[i]["setStart"] && todosWork[i]["done"]){
        todosWork[i]["startTime"] += "(" + formatTimeAndDay(todosWork[i]["timeStamp"]);
        todosWork[i]["setStart"] = true;
        todosWork[i]["endTime"] = " - " + todosWork[i]["temp"] + ")";
    }
    if (!todosWork[i]["setStart"]){
        todosWork[i]["startTime"] = "(" + formatTimeAndDay(todosWork[i]["timeStamp"]) + ")";
        todosWork[i]["setStart"] = true;
    }
  }
  res.render("work.ejs", {list: todosWork, date: currentWeek}) 
});

//Daily
app.post("/removeTimeStamp", (req, res) =>{
    for (let i = 0; i < todos.length; i++){
      todos[i]["startTime"] = "";
      todos[i]["endTime"] = "";
      todos[i]["setStart"] = false;
      todos[i]["setEnd"] = false;
    }
    res.render("index.ejs", {list: todos, date: currentDay, today: currentDate});
});

//Work
app.post("/removeTimeStampWork", (req, res) =>{
  for (let i = 0; i < todosWork.length; i++){
    todosWork[i]["startTime"] = "";
    todosWork[i]["endTime"] = "";
    todosWork[i]["setStart"] = false;
    todosWork[i]["setEnd"] = false;
  }
  res.render("work.ejs", {list: todosWork, date: currentWeek});
});

//Daily
app.post("/deleteAll", (req, res) => {
  todos = [];
  res.render("index.ejs",{list: todos, date: currentDay, today: currentDate});
});

//Work
app.post("/deleteAllWork", (req, res) => {
  todosWork = [];
  res.render("work.ejs",{list: todosWork, date: currentWeek});
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

function formatTime(timestamp) {
  const date = new Date(timestamp);
  let stunden = date.getHours();
  const minuten = String(date.getMinutes()).padStart(2, '0');
  const amOderPm = stunden < 12 ? 'am' : 'pm';
  if (stunden > 12) {
    stunden -= 12;
  }
  if (stunden === 0) {
    stunden = 12; 
  }
  return `${stunden}:${minuten} ${amOderPm}`;
}

function formatTimeAndDay(timestamp) {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const date = new Date(timestamp);
  const dayOfWeek = daysOfWeek[date.getDay()];
  const hour = date.getHours();
  const period = hour >= 12 ? "pm" : "am";
  const hour12 = hour > 12 ? hour - 12 : hour;
  return `${dayOfWeek}, ${hour12} ${period}`;
}

function getCurrentDay() {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDate = new Date();
  const dayOfWeek = daysOfWeek[currentDate.getDay()];
  const formattedDay = `${dayOfWeek}`;
  return formattedDay;
}

function getCurrentDate(){
  const currentDate = new Date();
  const dayOfMonth = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Monate sind nullbasiert, daher +1
  const formattedDate = `${dayOfMonth < 10 ? '0' : ''}${dayOfMonth}.${month < 10 ? '0' : ''}${month}`;
  return formattedDate;
}

function getCurrentCalendarWeek() {
  const now = new Date();
  const year = now.getFullYear();
  const janFirst = new Date(year, 0, 1);
  const daysSinceJanFirst = Math.floor((now - janFirst) / (24 * 60 * 60 * 1000));
  const weekNum = Math.ceil((daysSinceJanFirst + janFirst.getDay() + 1) / 7);
  let weekSuffix = "th";
  if (weekNum === 11 || weekNum === 12 || weekNum === 13) {
    weekSuffix = "th";
  } else {
    const lastDigit = weekNum % 10;
    if (lastDigit === 1) {
      weekSuffix = "st";
    } else if (lastDigit === 2) {
      weekSuffix = "nd";
    } else if (lastDigit === 3) {
      weekSuffix = "rd";
    }
  }
  return `${weekNum}${weekSuffix} Week`;
}

