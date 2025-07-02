'use server';

import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
//import { addDoc, collection, deleteDoc, doc, Timestamp, updateDoc } from "firebase/firestore";
import { Movie } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { initAdmin } from "@/utils/firebase";

type ShowtimeFormData = {
  movieId: string
  date: string
  time: string
}

type MessageData = {
  topic: string;
  title: string;
  body: string;
}

const addMovieImdb = async (imdbId: string) => {

}

const addMovie = async (data: Movie) => {
  const supabase = await createClient();
  const { data: movie, error } = await supabase
    .from('movie')
    .insert([data])
  if (error) {
    return {error: error}
  }
  revalidatePath('/movies');
  return {error:null}
}


export async function updateMovie(id: string, data: Movie) {
  const supabase = await createClient();
  const { data: movie, error } = await supabase
    .from('movie')
    .update(data)
    .eq('id', id)
  if (error) {
    return {error: error}
  }
  console.log("Movie updated:", id);
  revalidatePath('/movies');
  return {error:null}
}

const addShowtime = async (theaterId:string, showtime:ShowtimeFormData) => {
  const supabase = await createClient();
  const [year, month, day] = showtime.date.split('-').map(Number);
  const dateAtMidnight = new Date(year, month - 1, day, 0, 0);
  const [hours, minutes] = showtime.time.split(':').map(Number);
  const dateWithStartTime = new Date(year, month - 1, day, hours, minutes);
  const payload = {
    date: dateAtMidnight,
    startTime: dateWithStartTime,
    movieId: showtime.movieId,
    theaterId: theaterId
  }
  console.log(payload);
  const { data, error } = await supabase
    .from('schedule')
    .insert([payload])
  if (error) {
    return {error: error}
  }
  revalidatePath('/showtimes');
  return {error:null}
}


const deleteShowtime = async (schedId: string) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from('schedule')
    .delete()
    .eq('id', schedId)
  if (error) {
    return {error: error}
  }
  console.log("Showtime deleted:", schedId)
  revalidatePath('/showtimes')
  return {error:null}
}



async function editShowtime(schedId: string, data: ShowtimeFormData) {
  const supabase = await createClient();
  const [year, month, day] = data.date.split('-').map(Number);
  const dateAtMidnight = new Date(year, month - 1, day, 0, 0);
  const [hours, minutes] = data.time.split(':').map(Number);
  const dateWithStartTime = new Date(year, month - 1, day, hours, minutes);
  const payload = {
    date: dateAtMidnight,
    startTime: dateWithStartTime,
    movieId: data.movieId,
  }
  const { error } = await supabase
    .from('schedule')
    .update(payload)
    .eq('id', schedId)
  if (error) {
    return {error: error}
  }
  console.log("Showtime updated:", schedId)
  revalidatePath('/showtimes');
  return {error:null}
}

async function sendMessage(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const body = formData.get('body') as string;

    const message = {
      topic: 'global',
      notification: {
        title: title,
        body: body,
      },
      data: {
        'screen': "home",
      }
    };
    console.log("message", message);
    await initAdmin();
    const messageS =  getMessaging();
    const response =  await messageS.send(message)
    console.log('Successfully sent message:', response);
    revalidatePath('/notifications');
    return { error: null };
  } catch (error) {
    console.error('Error sending message:', error);
    return { error: error };
  }
}

export{ addMovie, addShowtime, deleteShowtime, editShowtime, addMovieImdb, sendMessage}