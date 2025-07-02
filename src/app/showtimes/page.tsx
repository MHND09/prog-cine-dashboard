
import ShowtimeTabs from '@/components/ShowtimeTabs';
import { initAdmin } from "@/utils/firebase";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { Showtime } from '@/lib/definitions';
/* import { and, collection, doc, getDoc, getDocs, query, Timestamp, where } from 'firebase/firestore'; */
import { clerkClient } from '@clerk/nextjs/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/utils/supabase/server';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { ShowtimesList } from '@/components/ShowtimesList';

export default async function ShowtimesPage(props: {
  searchParams?:
  Promise<{ edit?: string}>;
}) {
  const searchParams = await props.searchParams
  const edit = searchParams?.edit || ''
  const theaterId = await getTheaterId();
  const {error, showtimes} = await fetchShowtimes(theaterId, new Date())
  if (error || showtimes === null) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>There Was An Error Loading Showtimes</AlertTitle>
          <AlertDescription>if you think this happened by mistake, please contact your administrator.</AlertDescription>
        </Alert>
      </div>
    )
    
  } else {
    const scheduleList = showtimes
    console.log("weee good schedule",scheduleList)
    // yeah you guessed it, I'll be passing that prop 3 components deep
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold mb-8">Showtimes</h1>
        <Link href="/showtimes/add">
            <Button>Add a Showtime</Button>
          </Link>
          </div>
          <ShowtimesList showtimes={scheduleList}/>
      </div>
    )
  }
}



async function getTheaterId() {
  const { userId } = await auth();
  const client = await clerkClient();
  const user = await client.users.getUser(userId as string);
  const theaterId = typeof user.privateMetadata?.theater_id === 'string' ? user.privateMetadata.theater_id : process.env.DEFAULT_THEATER_ID as string;
  return theaterId;
}

async function fetchShowtimes(
  theaterId: string,
  startDate: Date) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('schedule')
    .select('id, startTime, theaterId, date, movie!inner(id, name) ')
    .gte('startTime', startDate.toISOString())
    .eq('theaterId', theaterId)
  if (error) {
    return {error: error, showtimes:null}
  }
  //any because I got enough
  const showtimes = data.map((showtime: any) => {
    return {
      id: showtime.id,
      date: new Date(showtime.date),
      movieId: showtime.movie.id,
      startTime: new Date (showtime.startTime),
      theaterId: showtime.theaterId,
      movieTitle: showtime.movie.name
    }
  })
  return {
    error: null,
    showtimes: showtimes as Showtime[]
  }
}


type ScheduleQueryResult = {
  id: string
  startTime: string
  theaterId: string
  date: string
  movie: {
    id: string,
    name: string
  } 
}