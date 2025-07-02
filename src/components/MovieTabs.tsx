import { Movie } from "@/lib/definitions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MovieList } from '@/components/MovieList'
import { AddMovieForm } from '@/components/AddMovieForm'
import  EditMovieForm  from './EditMoviePage'

export default function MovieTabs({
  searchParams,
  movieList,
}: {
  searchParams: { edit?: string }
  movieList: Movie[]
}) {
  console.log(searchParams)
  console.log("cooooooooooooool")
  const editMovieId = searchParams?.edit
  const activeTab = editMovieId ? "edit-movie" : "all-movies"
  console.log(activeTab)

  return (
    <Tabs defaultValue={activeTab} className="w-full" >
      <TabsList>
        <TabsTrigger value="all-movies">All Movies</TabsTrigger>
        <TabsTrigger value="add-movie">Add Movie</TabsTrigger>
        {editMovieId && (
          <TabsTrigger value="edit-movie">Edit Movie</TabsTrigger>
        )
          }
      </TabsList>
      <TabsContent value="all-movies">
        <MovieList movieList={movieList} />
      </TabsContent>
      <TabsContent value="add-movie">
        <AddMovieForm />
      </TabsContent>
      {editMovieId && (
        <TabsContent value="edit-movie">
          <EditMovieForm params={{
            movieId: editMovieId
          }} />
        </TabsContent>
      )}
    </Tabs>
  )
}
