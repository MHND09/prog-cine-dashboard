// ShowtimeTabs.tsx (Server Component)
import { Showtime } from '@/lib/definitions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShowtimesList } from '@/components/ShowtimesList'
import { AddShowtimeForm } from '@/components/AddShowtimeForm'
import EditShowtimePage from './EditShowtimePage'
import { getMovies } from './EditShowtimePage'

export default async function ShowtimeTabs({
  scheduleList,
  theaterId,
  searchParams
}: {
  scheduleList: Showtime[],
  theaterId: string
  searchParams: { edit?: string }
}) {
  const editShowtimeId = searchParams.edit
  const activeTab = editShowtimeId ? 'edit-showtime' : 'all-showtimes'
  const { movies } = await getMovies()

  return (
    <Tabs defaultValue={activeTab} className="w-full">
      <TabsList>
        <TabsTrigger value="all-showtimes">All Showtimes</TabsTrigger>
        <TabsTrigger value="add-showtime">Add Showtime</TabsTrigger>
      </TabsList>
      <TabsContent value="all-showtimes">
        <ShowtimesList showtimes={scheduleList} />
      </TabsContent>
      <TabsContent value="add-showtime">
        <AddShowtimeForm theaterId={theaterId} movies={movies ?? []} />
      </TabsContent>
      {editShowtimeId && (
        <>
          <TabsList>
            <TabsTrigger value="edit-showtime">Edit Showtime</TabsTrigger>
          </TabsList>
          <TabsContent value="edit-showtime">
            <EditShowtimePage params={{
              showtimeId:editShowtimeId
            }} />
          </TabsContent>
        </>
      )}
    </Tabs>
  )
}