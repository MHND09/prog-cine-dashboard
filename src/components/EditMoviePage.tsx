import { Movie } from '@/lib/definitions'
import { EditMovieForm } from './EditMovieForm'
import { createClient } from "@/utils/supabase/server";
import { Link, AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { Button } from './ui/button';

async function getMovieSupabase(movieId: string) {
    const supabase = await createClient();
  const { data: movies, error } = await supabase
    .from('movie')
    .select('*') as { data: Movie[], error: any}
  if (error) {
    return { error: error, movies: null }
  }
  return { error: null, movies: movies }
}

export default async function EditMoviePage({ params }: { params: { movieId: string } }) {
    const movieId = params.movieId
        const {error, movies} = await getMovieSupabase(movieId)
        if (error|| movies===null){
            return (
                <div className="container mx-auto py-8">
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>There Was An Error Loading Movie</AlertTitle>
                    <AlertDescription>if you think this happened by mistake, please contact your administrator.</AlertDescription>
                  </Alert>
                </div>
              )
        }
        else if (movies.length == 0){
            return (
                <Alert variant="default" className="mt-4 bg-gray-100 text-gray-800 border-gray-300">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Movie Not Found</AlertTitle>
                  <AlertDescription>
                  If you think this happened by mistake, please contact your administrator.
                  </AlertDescription>
                </Alert>
              )
        }
        const movie = movies[0] // this may not be the best way to do it, but I believe I did the necessary checks
        return (
            <div>
                <h1>Edit Movie</h1>
                <EditMovieForm movie={movie} movieId={movieId} />
            </div>
        )
}