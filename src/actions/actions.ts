'use server';

import { getFirestore, Timestamp } from "firebase-admin/firestore";
//import { addDoc, collection, deleteDoc, doc, Timestamp, updateDoc } from "firebase/firestore";
import { Movie } from "@/lib/definitions";
import { revalidatePath } from "next/cache";


type ShowtimeFormData = {
  movieId: string
  date: string
  time: string
}
const addMovieImdb = async (imdbId: string) => {

}



const addMovie = async (data:Movie) => {
    const firestore = getFirestore();
    const collectionRef = firestore.collection("movies");
    console.log(data);
    console.log(collectionRef);
    await collectionRef.add(data);
    revalidatePath('/movies')
}

export async function updateMovie(id: string, data: Movie) {
  const firestore = getFirestore();
  const docRef = firestore.collection("movies").doc(id);
  console.log(data);
  await docRef.update(data);
  console.log("Movie updated:", id);
  revalidatePath('/movies');
}


const addShowtime = async (theaterId:string, showtime:ShowtimeFormData) => {
  const firestore = getFirestore();
  const collectionRef = firestore.collection("schedule");
  console.log(showtime);
  console.log(theaterId);
  const [year, month, day] = showtime.date.split('-').map(Number);
  const dateAtMidnight = new Date(year, month - 1, day, 0, 0);
  const [hours, minutes] = showtime.time.split(':').map(Number);
  const dateWithStartTime = new Date(year, month - 1, day, hours, minutes);
  const timestampDate = Timestamp.fromDate(dateAtMidnight);
  const timestampStartTime = Timestamp.fromDate(dateWithStartTime);
  const payload = {
    date: timestampDate,
    startTime: timestampStartTime,
    movieId: showtime.movieId,
    theaterId: theaterId
  }
  console.log(payload);
  await collectionRef.add(payload);
  console.log("Showtime added");
  revalidatePath('/showtimes')
}

const deleteShowtime = async (schedId: string) => {
  const firestore = getFirestore();
  
  const docRef = firestore.collection("schedule").doc(schedId);
  await docRef.delete();
  console.log("Showtime deleted:", schedId)
  revalidatePath('/showtimes')
}

const editShowtime = async (schedId: string, data: ShowtimeFormData) => {
  const firestore = getFirestore();
  const docRef = firestore.collection("schedule").doc(schedId);
  const [year, month, day] = data.date.split('-').map(Number);
  const dateAtMidnight = new Date(year, month - 1, day, 0, 0);
  const [hours, minutes] = data.time.split(':').map(Number);
  const dateWithStartTime = new Date(year, month - 1, day, hours, minutes);
  const timestampDate = Timestamp.fromDate(dateAtMidnight);
  const timestampStartTime = Timestamp.fromDate(dateWithStartTime);
  const payload = {
    date: timestampDate,
    startTime: timestampStartTime,
    movieId: data.movieId,
  }
  await docRef.update(payload);
  console.log("Showtime updated:", schedId)
  revalidatePath('/showtimes')
}


export{ addMovie, addShowtime, deleteShowtime, editShowtime, addMovieImdb}