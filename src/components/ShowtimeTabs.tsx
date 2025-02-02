// ShowtimeTabs.tsx (Server Component)
import { Movie, Showtime } from '@/lib/definitions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShowtimesList } from '@/components/ShowtimesList'
import { AddShowtimeForm } from '@/components/AddShowtimeForm'
import { EditShowtimeForm } from '@/components/EditShowtimeForm'
import EditShowtimePage from './EditShowtimePage'
import { initAdmin } from '@/config/firebase'
import { getFirestore } from 'firebase-admin/firestore'
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
  const movies = await getMovies()

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
        <AddShowtimeForm theaterId={theaterId} movies={movies} />
      </TabsContent>
      {editShowtimeId && (
        <>
          {/* Optional tab button if desired */}
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