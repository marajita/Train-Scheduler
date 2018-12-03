// Initialize Firebase
var config = {
  apiKey: "AIzaSyCggHntOKZlWDP1CcQfwr24E86gvqGEd1g",
  authDomain: "train-shchedule-e6938.firebaseapp.com",
  databaseURL: "https://train-shchedule-e6938.firebaseio.com",
  projectId: "train-shchedule-e6938",
  storageBucket: "train-shchedule-e6938.appspot.com",
  messagingSenderId: "994014364293"
};
firebase.initializeApp(config);

// Assign the reference to the database to a variable named 'database'
var database = firebase.database();

$(document).ready(function() {
  // Capture Button Click
  $("#submitBtn").on("click", function(event) {
    // prevent form from trying to submit/refresh the page
    event.preventDefault();

    // Capture User Inputs and store them into variables
    var newName = $("#name")
      .val()
      .trim();
    var newPlace = $("#place")
      .val()
      .trim();
    var newTime = $("#trainTime")
      .val()
      .trim();
    var newFrequency = $("#frequency")
      .val()
      .trim();

    console.log(newName);
    console.log(newPlace);
    console.log(newTime);
    console.log(newFrequency);

    //pushing to DB
    //Here "name" is the key that we chose and the newName is the value of the key
    database.ref().push({
      name: newName,
      place: newPlace,
      trainTime: newTime,
      frequency: newFrequency
    });
    document.getElementById("tForm").reset();
  });
  database.ref().on("child_added", function(snapshot) {
    var newRow = $("<tr>");
    var trainNameDB = snapshot.val().name;
    var destNameDB = snapshot.val().place;
    var firstTrainTimeDB = snapshot.val().trainTime;
    var trainFreqDB = snapshot.val().frequency;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTrainTimeDB, "HH:mm").subtract(
      1,
      "years"
    );
    console.log(firstTimeConverted);
    console.log(
      "TRAIN Start TIME: " + moment(firstTimeConverted).format("HH:mm")
    );

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    // Difference between the times (train start time and current time in minutes)
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // TimeA.diff(TimeB, "min")
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % trainFreqDB;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = trainFreqDB - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

    newRow
      .append("<td>" + trainNameDB + "</td>")
      .append("<td>" + destNameDB + "</td>")
      .append("<td>" + trainFreqDB + "</td>")
      .append("<td>" + nextTrain.format("HH:mm") + "</td>")
      .append("<td>" + tMinutesTillTrain + "</td>");

    $("#table").append(newRow);
  });
});
