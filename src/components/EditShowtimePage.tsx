import { initAdmin } from "@/utils/firebase"
import { getFirestore } from "firebase-admin/firestore"
import { format } from "date-fns"
import { EditShowtimeForm } from "./EditShowtimeForm"
import { Showtime, Movie } from "@/lib/definitions"
import { createClient } from "@/utils/supabase/server"
import { firestore } from "firebase-admin"
import { AlertCircle } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "./ui/alert"

export async function getMovies() {
  const supabase = await createClient()
  const { data: movies, error } = await supabase
    .from("movie")
    .select("*") as { data: Movie[], error: any }
  if (error) {
    return { error: error, movies: null }
  }
  return { error: null, movies: movies }
}
async function getShowtime(showtimeId: String) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("schedule")
    .select("date ,startTime ,movieId")
    .eq("id", showtimeId)
    if (error) {
      return { error: error, showtime: null }
    }
    return { error: null, showtime: data }
}




export default async function EditShowtimePage({
  params
}: {
  params: { showtimeId: string }
}) {
  const showtimeId = params.showtimeId
  const {error, showtime: showtimes} = await getShowtime(showtimeId)
  if (error || showtimes === null) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>There Was An Error Loading Showtime</AlertTitle>
          <AlertDescription>if you think this happened by mistake, please contact your administrator.</AlertDescription>
        </Alert>
      </div>
    )
  }
  else if (showtimes.length == 0) {
    return (
      <Alert variant="default" className="mt-4 bg-gray-100 text-gray-800 border-gray-300">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Schedule Not Found</AlertTitle>
        <AlertDescription> there is no schedule with the id specified.
        If you think this happened by mistake, please contact your administrator.
        </AlertDescription>
      </Alert>
    )
  }
  const showtimeData = showtimes[0]
  const dateStr = format(new Date(showtimeData.date), "yyyy-MM-dd")
  const timeStr = format(new Date(showtimeData.startTime), "HH:mm")

  // Fetch movies
  const {error: err, movies} = await getMovies();
  if (err || movies === null) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>There Was An Error Loading Movies</AlertTitle>
          <AlertDescription>if you think this happened by mistake, please contact your administrator.</AlertDescription>
        </Alert>
      </div>
    )
  }

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