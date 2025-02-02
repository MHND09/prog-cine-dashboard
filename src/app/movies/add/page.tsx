import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { AddMovieForm } from "@/components/AddMovieForm"
import AddImdb from "./(imdbId)/AddImdb"
import SearchMovie from "./(searchMovie)/SearchMovie"

export default async function AddMoviesPage(props: {
  searchParams?:
  Promise<{ query?: string; page?: string; }>;
}) {
  const searchParams = await props.searchParams
  let mainTab = "manual"
  if (searchParams?.query){
    mainTab = "name"
  }
  return (
    <div className="w-full min-h-screen p-8 bg-gray-50">
      <div className="mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-4">Add Movies</h1>
        <Tabs defaultValue={mainTab} className="w-full">
            <TabsList className="mb-6 flex justify-center w-auto">
            <TabsTrigger value="manual">Manual</TabsTrigger>
            <TabsTrigger value="imdb">By IMDb ID</TabsTrigger>
            <TabsTrigger value="name">By Name</TabsTrigger>
            </TabsList>
          {/* Manual Tab */}
          <TabsContent value="manual" className="space-y-4">
            <h2 className="text-xl font-semibold">Manually Add a Movie</h2>
            <AddMovieForm />
          </TabsContent>
          {/* IMDb Tab */}
          <TabsContent value="imdb" className="space-y-6">
            <AddImdb/>
          </TabsContent>
          {/* Name Tab */}
          <TabsContent value="name" className="space-y-6">
            <SearchMovie searchParams={
              props.searchParams
            } />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}