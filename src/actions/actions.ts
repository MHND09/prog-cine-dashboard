'use server';

import { db } from "@/config/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { Movie } from "@/lib/definitions";


type ShowtimeFormData = {
  movieId: string
  date: String
  time: String
}

const addMovie = async (data:Movie) => {
    const collectionRef = collection(db, "moviesTestD");
    console.log(data);
    console.log(collectionRef);
    await addDoc(collectionRef, data);
}


const addShowtime = async (theaterId:String, showtime:ShowtimeFormData) => {
  
  const collectionRef = collection(db, "/scheduleTestD");
  console.log(showtime);
  console.log(theaterId);

  // Parse the date
  const [year, month, day] = showtime.date.split('-').map(Number);

  // Create a Date object for 12 AM
  const dateAtMidnight = new Date(year, month - 1, day, 0, 0);

  // Parse the time
  const [hours, minutes] = showtime.time.split(':').map(Number);

  // Create a Date object for the specified start time
  const dateWithStartTime = new Date(year, month - 1, day, hours, minutes);

  // Convert to Firebase Timestamps
  const timestampDate = Timestamp.fromDate(dateAtMidnight);
  const timestampStartTime = Timestamp.fromDate(dateWithStartTime);

  const payload = {
    date: timestampDate,
    startTime: timestampStartTime,
    movieId: showtime.movieId,
    theaterId: theaterId
  }
  console.log(payload);
  await addDoc(collectionRef, payload);
  console.log("Showtime added");
}

export{ addMovie, addShowtime}