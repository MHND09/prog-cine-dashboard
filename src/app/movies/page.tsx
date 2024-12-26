import { MovieTabs } from "@/components/MovieTabs"
import { db } from "@/config/firebase"
import { Movie } from "@/lib/definitions"
import { collection, getDocs } from "firebase/firestore"
async function getMovies() {
  const collectionRef = collection(db, "movies")
  const movCollectionSnap = await getDocs(collectionRef)
  const movieList = movCollectionSnap.docs.map(doc => ({
    ...doc.data(),
    id: doc.id
  } as Movie))
  return movieList
}



export default async function MoviesPage() {
  const movieList = await getMovies()
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Movies</h1>
      <MovieTabs movieList={movieList}/>
    </div>
  )
}