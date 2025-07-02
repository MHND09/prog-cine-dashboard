"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { editShowtime } from "@/actions/actions"
import { Showtime, Movie } from "@/lib/definitions"
import { AlertCircle } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "./ui/alert"

type ShowtimeFormData = {
  movieId: string
  date: string
  time: string
}

type EditShowtimeFormProps = {
  showtimeId: string
  showtime: ShowtimeFormData
  movies: Movie[]
}
// you may wonder why I am using these useless parameters
// in fact I am doing it just for convenience for the form data
export function EditShowtimeForm({ showtimeId, showtime, movies }: EditShowtimeFormProps) {
  const { register, handleSubmit, formState: { errors }, control, reset } =
    useForm<ShowtimeFormData>({ defaultValues: showtime })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()

  const onSubmit = async (data: ShowtimeFormData) => {
    setIsSubmitting(true)
    setSuccessMessage(null)
    setErrorMessage(null)
    console.log(data)
    const {error } = await editShowtime(showtimeId, data)
    if (error) {
      setErrorMessage("An error occurred while updating the showtime. Please try again. If the problem persists, contact support.")
    }
    else {
      setSuccessMessage("Showtime updated successfully")
      reset()
    }
    setIsSubmitting(false)
  }

  const handleCancel = () => {
    router.push("/showtimes")
  }

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
      control={control}
      name={'movieId'}
      defaultValue={showtime.movieId}
      rules={{ required: 'Movie is required' }}
      render={({ field }) => (
        <>
          <Select onValueChange={field.onChange} {...field} >
            <SelectTrigger>
              <SelectValue placeholder="Select movie" />
            </SelectTrigger>
            <SelectContent >
              {movies
                .filter(movie => movie.id !== undefined)
                .map(movie => (
                  <SelectItem key={movie.id} value={movie.id!}>{movie.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.movieId && <p className="text-red-500">{errors.movieId.message}</p>}
        </>
      )}
      />

      <Input {...register("date", { required: "Date is required" })} type="date" />
      {errors.date && <p className="text-red-500">{errors.date.message}</p>}

      <Input {...register("time", { required: "Time is required" })} type="time" />
      {errors.time && <p className="text-red-500">{errors.time.message}</p>}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving Changes..." : "Save Changes"}
        </Button>
      </div>
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