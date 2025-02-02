import { initAdmin } from "@/config/firebase"
import { getFirestore } from "firebase-admin/firestore"
import { format } from "date-fns"
import { EditShowtimeForm } from "./EditShowtimeForm"
import { Showtime, Movie } from "@/lib/definitions"

export default async function EditShowtimePage({
  params
}: {
  params: { showtimeId: string }
}) {
  await initAdmin()
  const firestore = getFirestore()
  const showtimeId = params.showtimeId

  // Fetch the showtime
  const scheduleDoc = firestore.doc(`schedule/${showtimeId}`)
  const scheduleSnapshot = await scheduleDoc.get()
  if (!scheduleSnapshot.exists) {
    return <div>No such showtime</div>
  }
  const showtimeData = scheduleSnapshot.data() as {
    movieId: string
    date: FirebaseFirestore.Timestamp
    startTime: FirebaseFirestore.Timestamp
  }
  const dateStr = format(showtimeData.date.toDate(), "yyyy-MM-dd")
  const timeStr = format(showtimeData.startTime.toDate(), "HH:mm")

  // Fetch movies
  const moviesCol = await firestore.collection("movies").get()
  const movies = moviesCol.docs.map((doc) => ({
    ...(doc.data() as Movie),
    id: doc.id
  }))

  return (
    <div>
      <h1>Edit Showtime</h1>
      <EditShowtimeForm
        showtimeId={showtimeId}
        showtime={{
          movieId: showtimeData.movieId,
          date: dateStr,
          time: timeStr
        }}
        movies={movies}
      />
    </div>
  )
}