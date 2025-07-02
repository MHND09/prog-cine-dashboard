import MovieTabs from "@/components/MovieTabs"
import { Movie } from "@/lib/definitions"
import { MovieList } from "@/components/MovieList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from '@/utils/supabase/server';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
async function getMovies() {
  const supabase = await createClient();
  const { data: movies, error } = await supabase
    .from('movie')
    .select('*') as { data: Movie[], error: any}
  if (error) {
    return { error: error, movies: null }
  }
  return { error: null, movies: movies }
}


export default async function MoviesPage(props: {
  searchParams?:
  Promise<{ edit?: string }>;
}) {
  const searchParams = await props.searchParams
  const edit = searchParams?.edit || ''
  const { error, movies: movieList } = await getMovies()
  if (error || movieList === null) { // this could be made better
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-row justify-between">
          <h1 className="text-3xl font-bold mb-8">Movies</h1>
          <Link href="/movies/add">
            <Button>Add a Movie</Button>
          </Link>
        </div>
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>There Was An Error Loading Movies</AlertTitle>
          <AlertDescription>if you think this happened by mistake, please contact your administrator.</AlertDescription>
        </Alert>
      </div>
    )
  }
  else {
    console.log(JSON.stringify(movieList, null, 2))
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-row justify-between">
          <h1 className="text-3xl font-bold mb-8">Movies</h1>
          <Link href="/movies/add">
            <Button>Add a Movie</Button>
          </Link>
        </div>
        {movieList.length > 0 ?
          (<MovieList movieList={movieList} />)
          : (
            <Alert variant="default" className="mt-4 bg-gray-100 text-gray-800 border-gray-300">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No movie Found</AlertTitle>
              <AlertDescription>
                You can add a new movie by clicking the "Add a Movie" button above.
                <br />
                If you think this happened by mistake, please contact your administrator.
              </AlertDescription>
            </Alert>
          )
        }
      </div>
    )
  }
}