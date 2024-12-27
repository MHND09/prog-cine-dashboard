import { format, startOfWeek, endOfWeek, addWeeks } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { db } from '@/config/firebase'
import { collection, query, and, where, Timestamp, getDocs, doc, getDoc } from 'firebase/firestore'
import { deleteShowtime } from '@/actions/actions'



interface Showtime {
  id: string
  date: Date
  movieId: string
  startTime: Date
  theaterId: string
  movieTitle: string
}

type GroupedShowtimes = {
  [date: string]: Showtime[]
}

async function getShowtimes(theaterId: string, startDate: Date): Promise<Showtime[]> {
  const schedCollectionRef = collection(db, "schedule")
  const q = query(
    schedCollectionRef,
    and(
      where("date", ">=", Timestamp.fromDate(startDate)),
      where("theaterId", "==", theaterId)
    )
  )
  const scheduleSnapshot = await getDocs(q)
  const scheduleList = await Promise.all(
    scheduleSnapshot.docs.map(async (sched) => {
      const movieId = sched.data().movieId
      const movieRef = doc(db, "movies", movieId)
      const movieSnapshot = await getDoc(movieRef)
      const movieTitle = movieSnapshot.exists()
        ? movieSnapshot.data().name
        : "Error getting movie title"
      return {
        id: sched.id,
        date: sched.data().date.toDate(),
        movieId,
        startTime: sched.data().startTime.toDate(),
        theaterId: sched.data().theaterId,
        movieTitle,
      } as Showtime
    })
  )
  return scheduleList  
}

const groupShowtimesByDay = (showtimes: Showtime[], startDate: Date, endDate: Date): GroupedShowtimes => {
  return showtimes.reduce((acc, showtime) => {
    const date = showtime.date
    if (date >= startDate && date <= endDate) {
      const dayKey = format(date, 'yyyy-MM-dd')
      if (!acc[dayKey]) {
        acc[dayKey] = []
      }
      acc[dayKey].push(showtime)
    }
    return acc
  }, {} as GroupedShowtimes)
}

export function ShowtimesList({showtimes}: {showtimes: Showtime[]}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [showtimeToDelete, setShowtimeToDelete] = useState<Showtime | null>(null)

  const now = new Date('2024-12-20')
  const thisWeekStart = startOfWeek(now)
  const thisWeekEnd = endOfWeek(now)
  const nextWeekStart = addWeeks(thisWeekStart, 1)
  const nextWeekEnd = endOfWeek(nextWeekStart)

  const thisWeekShowtimes = groupShowtimesByDay(showtimes, thisWeekStart, thisWeekEnd)
  const nextWeekShowtimes = groupShowtimesByDay(showtimes, nextWeekStart, nextWeekEnd)

  const handleDeleteClick = (showtime: Showtime) => {
    setShowtimeToDelete(showtime)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (showtimeToDelete) {
      console.log(`Deleting showtime with id: ${showtimeToDelete.id}`)
      deleteShowtime(showtimeToDelete.id)
    }
    setIsDeleteDialogOpen(false)
    setShowtimeToDelete(null)
  }


  const renderShowtimes = (groupedShowtimes: GroupedShowtimes) => {
    if (Object.keys(groupedShowtimes).length === 0) {
      return <p className="text-center text-gray-500">No showtimes available for this week.</p>
    }

    return Object.entries(groupedShowtimes).map(([date, showtimes]) => (
      <Card key={date} className="mb-6">
        <CardHeader>
          <CardTitle>{format(showtimes[0].date, 'EEEE, MMMM d')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {showtimes.map((showtime) => (
              <div key={`${showtime.id}`} className="flex justify-between items-center">
                <span className="font-medium">{showtime.movieTitle}</span>
                <div className="flex items-center space-x-2">
                  <span>{format(showtime.startTime, 'h:mm a')}</span>
                  <Link href={`/showtimes?edit=${showtime.id}`} passHref>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(showtime)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    ))
  }

  return (
    <>
    <Tabs defaultValue="this-week" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="this-week">This Week</TabsTrigger>
        <TabsTrigger value="next-week">Next Week</TabsTrigger>
      </TabsList>
      <TabsContent value="this-week" className="mt-6">
        {renderShowtimes(thisWeekShowtimes)}
      </TabsContent>
      <TabsContent value="next-week" className="mt-6">
        {renderShowtimes(nextWeekShowtimes)}
      </TabsContent>
    </Tabs>
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this showtime?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the showtime.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className='bg-red-500 text-white
          ' onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
  )
}

