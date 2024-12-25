import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { AddMovieForm } from '@/components/AddMovieForm'
import { AddShowtimeForm } from '@/components/AddShowtimeForm'
import { MovieList } from '@/components/MovieList'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          <Tabs defaultValue="movies" className="space-y-4">
            <TabsList>
              <TabsTrigger value="movies">Movies</TabsTrigger>
              <TabsTrigger value="add-movie">Add Movie</TabsTrigger>
              <TabsTrigger value="add-showtime">Add Showtime</TabsTrigger>
            </TabsList>
            <TabsContent value="movies">
              <MovieList />
            </TabsContent>
            <TabsContent value="add-movie">
              <AddMovieForm />
            </TabsContent>
            <TabsContent value="add-showtime">
              <AddShowtimeForm />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

