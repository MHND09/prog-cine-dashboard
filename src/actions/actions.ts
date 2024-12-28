'use server';

import { db } from "@/config/firebase";
import { addDoc, collection, deleteDoc, doc, Timestamp, updateDoc } from "firebase/firestore";
import { Movie } from "@/lib/definitions";
import { revalidatePath } from "next/cache";


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
    revalidatePath('/movies')
}

export async function updateMovie(id: string, data: Movie) {
  const docRef = doc(db, 'movies', id)
  console.log(data);
  await updateDoc(docRef, data)
  console.log("Movie updated:", id)
  revalidatePath('/movies')
}


const addShowtime = async (theaterId:String, showtime:ShowtimeFormData) => {
  
  const collectionRef = collection(db, "/schedule");
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
  await addDoc(collectionRef, payload);
  console.log("Showtime added");
  revalidatePath('/showtimes')
}

const deleteShowtime = async (schedId: string) => {
  const docRef = doc(db, 'schedule', schedId)
  await deleteDoc(docRef)
  console.log("Showtime deleted:", schedId)
  revalidatePath('/showtimes')
}

const editShowtime = async (schedId: string, data: ShowtimeFormData) => {
  const docRef = doc(db, 'schedule', schedId)
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
  await updateDoc(docRef, payload)
  console.log("Showtime updated:", schedId)
  revalidatePath('/showtimes')
}


export{ addMovie, addShowtime, deleteShowtime, editShowtime}