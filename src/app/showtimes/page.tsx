
import ShowtimeTabs from '@/components/ShowtimeTabs';
import { initAdmin } from "@/config/firebase";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { Showtime } from '@/lib/definitions';
/* import { and, collection, doc, getDoc, getDocs, query, Timestamp, where } from 'firebase/firestore'; */
import { clerkClient } from '@clerk/nextjs/server'
import { auth } from '@clerk/nextjs/server'

export default async function ShowtimesPage(props: {
  searchParams?:
  Promise<{ edit?: string}>;
}) {
  const searchParams = await props.searchParams
  const edit = searchParams?.edit || ''
  const {userId} = await auth();
  const client = await clerkClient();
  const user = await client.users.getUser(userId as string);
  const theaterId = typeof user.privateMetadata?.theater_id === 'string' ? user.privateMetadata.theater_id : process.env.DEFAULT_THEATER_ID as string;
  const scheduleList = await fetchShowtimes(theaterId, new Date(2024, 11, 20))
  console.log(scheduleList)
  // yeah you guessed it, I'll be passing that prop 3 components deep
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Showtimes</h1>
      <ShowtimeTabs scheduleList={scheduleList} theaterId={theaterId} searchParams={{
        edit: edit
      }}/>
    </div>
  )
}

async function fetchShowtimes(
  theaterId: string,
  startDate: Date,
): Promise<Showtime[]> {
  await initAdmin()
  const firestore = getFirestore()
  console.log(startDate)
  const schedCollectionRef = firestore.collection("schedule")
  const query = schedCollectionRef.where("startTime", ">=", Timestamp.fromDate(startDate))
                                  .where("theaterId", "==", theaterId)
  
  const scheduleSnapshot = await query.get()
  const scheduleList = await Promise.all(
    scheduleSnapshot.docs.map(async (sched) => {
      const movieId = sched.data().movieId
      const movieRef = firestore.collection("movies").doc(movieId)
      const movieSnapshot = await movieRef.get()
      const movieTitle = movieSnapshot.exists
        ? movieSnapshot.data()!.name
        : "Error getting movie title"
      return {
        id: sched.id,
        date: sched.data().date.toDate(),
        movieId,
        startTime: sched.data().startTime.toDate(),
        theaterId: sched.data().theaterId,
        movieTitle,
      } as Showtime
    })
  )
  return scheduleList
}