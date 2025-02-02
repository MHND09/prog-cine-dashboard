import  MovieTabs  from "@/components/MovieTabs"
import { Movie } from "@/lib/definitions"
import { initAdmin } from "@/config/firebase";
import { getFirestore } from "firebase-admin/firestore";
import { MovieList } from "@/components/MovieList";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getMovies() {
  await initAdmin();
  const firestore = getFirestore();
  const collectionRef = firestore.collection("movies")
  const movCollectionSnap = await collectionRef.get();
  const movieList = movCollectionSnap.docs.map(doc => ({
    ...doc.data(),
    id: doc.id
  } as Movie))
  return movieList
}




export default async function MoviesPage(props: {
  searchParams?:
  Promise<{ edit?: string}>;
}) {
  const searchParams = await props.searchParams
  const edit = searchParams?.edit || ''
  const movieList = await getMovies()
  console.log(movieList)
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-row justify-between">
      <h1 className="text-3xl font-bold mb-8">Movies</h1>
      <Link href="/movies/add">
      <Button>Add a Movie</Button>
      </Link>
      </div>
      <MovieList movieList={movieList} />
    </div>
  )
}