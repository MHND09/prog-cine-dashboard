
import { ShowtimeTabs } from '@/components/ShowtimeTabs';
import { db } from '@/config/firebase';
import { Showtime } from '@/lib/definitions';
import { and, collection, doc, getDoc, getDocs, query, Timestamp, where } from 'firebase/firestore';

export default async function ShowtimesPage() {
  const scheduleList = await fetchShowtimes("pc0uCwNTM3sGYqNEaoCq", new Date("2024-12-20"))
  console.log(scheduleList)
  // yeah you guessed it, I'll be passing that prop 3 components deep
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Showtimes</h1>
      <ShowtimeTabs scheduleList={scheduleList}/>
    </div>
  )
}

async function fetchShowtimes(
  theaterId: string,
  startDate: Date
): Promise<Showtime[]> {
  const schedCollectionRef = collection(db, "schedule")
  const q = query(
    schedCollectionRef,
    and(
      where("date", ">=", Timestamp.fromDate(startDate)),
      where("theaterId", "==", theaterId)
    )
  )
  const scheduleSnapshot = await getDocs(q)
  const scheduleList = await Promise.all(
    scheduleSnapshot.docs.map(async (sched) => {
      const movieId = sched.data().movieId
      const movieRef = doc(db, "movies", movieId)
      const movieSnapshot = await getDoc(movieRef)
      const movieTitle = movieSnapshot.exists()
        ? movieSnapshot.data().name
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