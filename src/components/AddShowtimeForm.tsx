'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Movie } from '@/lib/definitions'
import { addShowtime } from '@/actions/actions'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from './ui/alert'

type ShowtimeFormData = {
  movieId: string
  date: string
  time: string
}

export function AddShowtimeForm({ theaterId, movies }: { theaterId: string, movies:Movie[] }) {

  const { register, handleSubmit,control,reset, formState: { errors } } = useForm<ShowtimeFormData>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onSubmit = async (data: ShowtimeFormData) => {
    setIsSubmitting(true)
    setSuccessMessage(null)
    setErrorMessage(null)
    console.log(data)
    const {error} =  await addShowtime(theaterId,data)
      if (error) {
        setErrorMessage("An error occurred while adding the showtime. Please try again. If the problem persists, contact support.")
      }
      else{
        setSuccessMessage("Showtime added successfully")
        reset()
      } 
      setIsSubmitting(false)
  }

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
      control={control}
      name={'movieId'}
      rules={{ required: 'Movie is required' }}
      render={({ field }) => (
        <>
          <Select onValueChange={field.onChange} {...field} >
            <SelectTrigger>
              <SelectValue placeholder="Select movie" />
            </SelectTrigger>
            <SelectContent >
              {movies.map(movie => (
                <SelectItem key={movie.id} value={movie.id}>{movie.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.movieId && <p className="text-red-500">{errors.movieId.message}</p>}
        </>
      )}
      />

      <Input {...register('date', { required: 'Date is required' })} type="date" />
      {errors.date && <p className="text-red-500">{errors.date.message}</p>}

      <Input {...register('time', { required: 'Time is required' })} type="time" />
      {errors.time && <p className="text-red-500">{errors.time.message}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding Showtime...' : 'Add Showtime'}
      </Button>
    </form>
     {successMessage && (
      <Alert variant="default" className="mt-4 bg-green-100 text-green-800 border-green-300">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>{successMessage}</AlertDescription>
      </Alert>
    )}

    {errorMessage && (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    )}
    </>
  )
}

