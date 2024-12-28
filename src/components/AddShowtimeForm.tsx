'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Movie } from '@/lib/definitions'
import { addShowtime } from '@/actions/actions'

type ShowtimeFormData = {
  movieId: string
  date: String
  time: String
}

export function AddShowtimeForm({ theaterId }: { theaterId: string }) {
  const [movies, setMovies] = useState<Movie[]>([])
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

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ShowtimeFormData>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  console.log(movies)
  const onSubmit = async (data: ShowtimeFormData) => {
    setIsSubmitting(true)
    console.log(data)
    await addShowtime(theaterId, data);
    setIsSubmitting(false)
    // Reset form or show success message
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select onValueChange={(value) => setValue('movieId', value, { shouldValidate: true })}>
        <SelectTrigger>
          <SelectValue placeholder="Select movie" />
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

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding Showtime...' : 'Add Showtime'}
      </Button>
    </form>
  )
}

