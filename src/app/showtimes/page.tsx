import { ShowtimesList } from '@/components/ShowtimesList'

export default function ShowtimesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Movie Showtimes</h1>
      <ShowtimesList />
    </div>
  )
}

