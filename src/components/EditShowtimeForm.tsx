"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { editShowtime } from "@/actions/actions"
import { Showtime, Movie } from "@/lib/definitions"

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

export function EditShowtimeForm({ showtimeId, showtime, movies }: EditShowtimeFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } =
    useForm<ShowtimeFormData>({ defaultValues: showtime })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const movieId = watch("movieId")

  const onSubmit = async (data: ShowtimeFormData) => {
    setIsSubmitting(true)
    await editShowtime(showtimeId, data)
    setIsSubmitting(false)
    router.push("/showtimes")
  }

  const handleCancel = () => {
    router.push("/showtimes")
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        value={movieId}
        onValueChange={(value) => setValue("movieId", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select movie" />
        </SelectTrigger>
        <SelectContent>
          {movies.map((movie) => (
            <SelectItem key={movie.id} value={movie.id}>
              {movie.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.movieId && <p className="text-red-500">{errors.movieId.message}</p>}

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
  )
}