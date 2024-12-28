'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Movie, Showtime } from '@/lib/definitions'
import { db } from '@/config/firebase'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { editShowtime } from '@/actions/actions'
import { format} from 'date-fns'
type ShowtimeFormData = {
  movieId: string
  date: string
  time: string
}

type EditShowtimeFormProps = {
  showtimeId: string
}


export function EditShowtimeForm({ showtimeId }: EditShowtimeFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ShowtimeFormData>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const [movies, setMovies] = useState<Movie[]>([])
  const movieId = watch('movieId')
  // fetching movies useEffect
  useEffect(() => {
    const fetchMovies = async () => {
      const moviesCollectionRef = collection(db, 'movies')
      const moviesSnapshot = await getDocs(moviesCollectionRef)
      const movies = moviesSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Movie))
      setMovies(movies)
    }
    fetchMovies()
  }, [])

  // fetching showtime useEffect
  useEffect(() => {
    const fetchShowtime = async () => {
      const scheduleDoc = doc(db, 'schedule', showtimeId)
      const scheduleSnapshot = await getDoc(scheduleDoc)
      if (!scheduleSnapshot.exists()) {
        console.error('No such document!')
        return
      }
      const showtime = scheduleSnapshot.data()
      
      const startTime = showtime.startTime.toDate()
      const date = showtime.date.toDate()
      const formattedTime =  format(startTime, 'HH:mm')
      const formattedDate =  format(date, 'yyyy-MM-dd')
      

      console.log(formattedDate)
      console.log(formattedTime)

      setValue('movieId', showtime.movieId)
      setValue('date', formattedDate)
      setValue('time', formattedTime)
      setIsLoading(false)

    }

    fetchShowtime()
  }, [showtimeId, setValue])

  const onSubmit = async (data: ShowtimeFormData) => {
    setIsSubmitting(true)
    console.log(data)
    await editShowtime(showtimeId, data)
    setIsSubmitting(false)
    router.push('/showtimes')
  }

  const handleCancel = () => {
    router.push('/showtimes')
  }

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select value={movieId} onValueChange={(value) => setValue('movieId', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select movie"  />
        </SelectTrigger>
        <SelectContent>
          {movies.map(movie => (
            <SelectItem key={movie.id} value={movie.id}>{movie.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.movieId && <p className="text-red-500">{errors.movieId.message}</p>}

      <Input {...register('date', { required: 'Date is required' })} type="date" />
      {errors.date && <p className="text-red-500">{errors.date.message}</p>}

      <Input {...register('time', { required: 'Time is required' })} type="time" />
      {errors.time && <p className="text-red-500">{errors.time.message}</p>}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}

