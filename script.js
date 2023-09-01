// variables
const today = new Date();
const main = document.querySelector("main");
let notesDB = JSON.parse(localStorage.getItem("notesDB")) || [];
let currentDayID = "";
let currentYear = "";
let currentMonthh = "";
const englishMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const shortEnglishWeekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// functions
// always shows to digits
function alwaysTwoDigits(num) {
  return num < 10 ? "0" + num : num;
}
// save to localStorage
function saveToLocalStorage() {
  localStorage.setItem("notesDB", JSON.stringify(notesDB));
}

function createFullYear(year) {
  main.innerHTML = "";
  for (let i = 0; i < 12; i++) {
    createMonth(new Date(`${year}`, `${i}`, 1), false);
  }
}

function createMonth(date, single) {
  currentYear = date.getFullYear();
  currentMonthh = date.getMonth();
  // functions
  function handlePrevChevron() {
    // go to previous month
    date = new Date(date.getFullYear(), date.getMonth() - 1);
    main.innerHTML = "";
    createMonth(date, true);
  }
  function handleNextChevron() {
    // go to next month
    date = new Date(date.getFullYear(), date.getMonth() + 1);
    main.innerHTML = "";
    createMonth(date, true);
  }
  function handleMonthNameContainerClick() {
    // when in year view select a month
    const newDate = new Date(dateYear, dateMonth);
    main.innerHTML = "";
    createMonth(newDate, true);
  }
  function handleYearContainerClick() {
    // when in single month view, creates year view
    main.innerHTML = "";
    createFullYear(dateYear, false);
  }
  function handleDayClick(e) {
    // when clicking on a day number
    const dayId = e.target.id;
    currentDayID = dayId;
    if (single) {
      // in month only view
      notesContainer.classList.remove("hidden");
      noteContainer.classList.remove("hidden");
      noteContainer.innerHTML = "";
      const existingNotes = notesDB.filter((note) => note.id === currentDayID);
      existingNotes.length !== 0 &&
        existingNotes[0].notes.forEach((note) => renderNote(note));
    } else {
      // in full year view
      main.innerHTML = "";
      const dayDay = Number(dayId.slice(0, 2));
      const dayMonth = dayId.slice(2, 4);
      const dayFullYear = dayId.slice(4);
      createMonth(new Date(dayFullYear, dayMonth, dayDay), true);
      // show notes sections and notes if existing
      const showAddNoteAndRenderNotesIfExisting = () => {
        const newNotesContainer = document.querySelector(".notes");
        const newNoteContainer = document.querySelector(".note-container");
        newNotesContainer.classList.remove("hidden");
        newNoteContainer.classList.remove("hidden");
        const existingNotes = notesDB.filter(
          (note) => note.id === currentDayID
        );
        existingNotes.length !== 0 &&
          existingNotes[0].notes.forEach((note) => renderNote2(note));
      };
      showAddNoteAndRenderNotesIfExisting();
    }
    // sets the selected day color to red
    document
      .querySelectorAll(".numbered")
      .forEach((el) => (el.style.color = "unset"));
    const dayInUse = document.getElementById(`${dayId}`);
    dayInUse.style.color = "red";

    function renderNote2(noteText) {
      const noteContainer2 = document.createElement("div");
      noteContainer2.classList.add("note-container2");
      const noteP = document.createElement("p");
      noteP.textContent = noteText;
      const noteImg = document.createElement("img");
      noteImg.classList.add("add-icon");
      noteImg.src = "./images/minus-solid.svg";
      noteImg.alt = "add Note";
      noteContainer2.append(noteP, noteImg);
      const newNoteContainer = document.querySelector(".note-container");
      newNoteContainer.append(noteContainer2);
      noteImg.addEventListener("click", handleRemoveNote2);

      function handleRemoveNote2(e) {
        const noteTextContent = e.target.previousElementSibling.textContent;
        const newArr = notesDB.filter((note) => note.id === currentDayID);
        const objNotesArr = newArr[0].notes;
        const targett = newArr[0].notes.indexOf(noteTextContent);
        objNotesArr.splice(targett, 1);
        const newNoteContainer = document.querySelector(".note-container");
        newNoteContainer.innerHTML = "";
        const existingNotes = notesDB.filter(
          (note) => note.id === currentDayID
        );
        existingNotes.length !== 0 &&
          existingNotes[0].notes.forEach((note) => renderNote2(note));
        saveToLocalStorage();
        addRemoveUnderline();
      }
    }
  }

  function handleRemoveNote(e) {
    const noteTextContent = e.target.previousElementSibling.textContent;
    const newArr = notesDB.filter((note) => note.id === currentDayID);
    const objNotesArr = newArr[0].notes;
    const targett = newArr[0].notes.indexOf(noteTextContent);
    objNotesArr.splice(targett, 1);
    noteContainer.innerHTML = "";
    const existingNotes = notesDB.filter((note) => note.id === currentDayID);
    existingNotes.length !== 0 &&
      existingNotes[0].notes.forEach((note) => renderNote(note));
    saveToLocalStorage();
    addRemoveUnderline();
  }

  function handleAddNote() {
    // if user input is not empty
    if (userInput.value !== "") {
      const obj = {
        id: currentDayID,
        notes: [userInput.value],
      };
      renderNote(userInput.value);
      let db = notesDB.find((note) => note.id === currentDayID);
      if (db) {
        db.notes = [...db.notes, userInput.value];
        userInput.value = "";
      } else {
        notesDB = [...notesDB, obj];
        userInput.value = "";
      }
      // add the underline as day with note
      addRemoveUnderline();
      // save to localStorage
      saveToLocalStorage();
    } else {
      // if userInput is empty
      userInput.placeholder = "Note must have some text";
    }
  }

  function addRemoveUnderline() {
    const allDays = document.querySelectorAll(".day");
    allDays.forEach((day) => {
      if (notesDB.some((date) => date.id === day.id && date.notes.length > 0)) {
        day.classList.add("day-with-note");
      } else {
        day.classList.remove("day-with-note");
      }
    });
  }

  function renderNote(noteText) {
    const noteContainer2 = document.createElement("div");
    noteContainer2.classList.add("note-container2");
    const noteP = document.createElement("p");
    noteP.textContent = noteText;
    const noteImg = document.createElement("img");
    noteImg.classList.add("add-icon");
    noteImg.src = "./images/minus-solid.svg";
    noteImg.alt = "add Note";
    noteContainer2.append(noteP, noteImg);
    noteContainer.append(noteContainer2);
    noteImg.addEventListener("click", handleRemoveNote);
  }

  // variables
  const dateMonth = date.getMonth();
  const dateYear = date.getFullYear();
  // create elements
  const monthContainer = document.createElement("section");
  const monthNameContainer = document.createElement("div");
  const yearContainer = document.createElement("div");
  const dayContainer = document.createElement("div");
  // create chevrons if showing single month
  if (single) {
    const prevChevron = document.createElement("img");
    const nextChevron = document.createElement("img");
    // add classes, ids and attributes
    prevChevron.classList.add("chevron");
    nextChevron.classList.add("chevron");
    prevChevron.id = "prevChevron";
    nextChevron.id = "nextChevron";
    prevChevron.alt = "go to previous month";
    nextChevron.alt = "go to next month";
    prevChevron.src = "./images/chevron-left-solid.svg";
    nextChevron.src = "./images/chevron-right-solid.svg";
    // append chevrons
    monthContainer.append(prevChevron, nextChevron);
    // event listeners
    prevChevron.addEventListener("click", handlePrevChevron);
    nextChevron.addEventListener("click", handleNextChevron);
  }

  // add classes, ids and attributes
  monthContainer.classList.add("month-container");
  monthNameContainer.classList.add("month-name-container");
  yearContainer.classList.add("year-container");
  dayContainer.classList.add("day-container");
  // event listeners
  if (!single) {
    // event listeners
    monthNameContainer.addEventListener("click", handleMonthNameContainerClick);
    monthNameContainer.classList.add("numbered");
  }
  if (single) {
    yearContainer.addEventListener("click", handleYearContainerClick);
    yearContainer.classList.add("numbered");
  }

  // add text content
  monthNameContainer.textContent = englishMonths[dateMonth];
  yearContainer.textContent = dateYear;
  // create and append day names
  for (let i = 1; i <= 7; i++) {
    const dayName = document.createElement("div");
    dayName.classList.add("day-name");
    const index = i < 7 ? i : 0;
    dayName.textContent = shortEnglishWeekDays[index];
    dayContainer.append(dayName);
  }
  // find position of first day of the month
  const firstDayOfMonth = new Date(`${dateYear}`, `${dateMonth}`, "1").getDay();
  // num of spaces until first day
  const prevDaysRef = [6, 0, 1, 2, 3, 4, 5];
  // create spaces until first day
  const amountOfPrev = prevDaysRef[firstDayOfMonth];
  for (let i = 0; i < amountOfPrev; i++) {
    // createDay();
    const day = document.createElement("div");
    day.classList.add("day");
    dayContainer.append(day);
  }
  // find current month amount of days
  const monthNumOfDays = new Date(
    `${dateYear}`,
    `${dateMonth + 1}`,
    0
  ).getDate();
  // create and append days
  for (let i = 1; i <= monthNumOfDays; i++) {
    const dayID = `${alwaysTwoDigits(i)}${alwaysTwoDigits(
      dateMonth
    )}${dateYear}`;
    const day = document.createElement("div");
    day.id = dayID;
    day.classList.add("day");
    day.classList.add("numbered");
    day.textContent = i;
    dayContainer.append(day);
    // find if this day is the current day
    if (
      i === today.getDate() &&
      today.getFullYear() === dateYear &&
      today.getMonth() === dateMonth
    ) {
      day.classList.add("current-day");
    }
    if (notesDB.some((date) => date.id === day.id && date.notes.length > 0)) {
      day.classList.add("day-with-note");
    }
    // eventListeners
    day.addEventListener("click", handleDayClick);
  }

  // create extra spaces so calendar always have six rows
  if (amountOfPrev + monthNumOfDays < 41) {
    for (let i = amountOfPrev + monthNumOfDays; i <= 35; i++) {
      // createDay();
      const day = document.createElement("div");
      day.classList.add("day");
      day.classList.add("black");
      day.textContent = "x";
      dayContainer.append(day);
    }
  }
  // create notes elements
  const notesContainer = document.createElement("section");
  notesContainer.classList.add("notes");
  notesContainer.classList.add("hidden");
  const notesP = document.createElement("p");
  notesP.textContent = "Notes";
  const inputContainer = document.createElement("div");
  inputContainer.classList.add("first-note-container");
  const userInput = document.createElement("input");
  userInput.placeholder = "Enter note text here";
  const inputImg = document.createElement("img");
  inputImg.src = "./images/plus-solid.svg";
  inputImg.alt = "add note";
  inputImg.classList.add("add-icon");
  // eventListeners
  inputImg.addEventListener("click", handleAddNote);
  const noteContainer = document.createElement("div");
  noteContainer.classList.add("note-container");
  noteContainer.classList.add("hidden");
  inputContainer.append(userInput, inputImg);
  notesContainer.append(notesP, inputContainer, noteContainer);
  // appendments
  monthContainer.append(
    monthNameContainer,
    yearContainer,
    dayContainer,
    notesContainer
  );
  // renderNote("Add a note");
  main.append(monthContainer);
}

// init
createMonth(today, true);
