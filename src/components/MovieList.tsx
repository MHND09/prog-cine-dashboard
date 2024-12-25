import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Movie = {
  id: string
  name: string
  year: number
  smallImage: string
  genre: string
  duration: number
  imdbRating: number
  rottenTomatoesRating: number
}

// This would typically come from your backend
const mockMovies: Movie[] = [
  {
    id: '1',
    name: 'Inception',
    year: 2010,
    smallImage: '/placeholder.svg',
    genre: 'Sci-Fi',
    duration: 148,
    imdbRating: 8.8,
    rottenTomatoesRating: 87,
  },
  // Add more mock movies here
]

export function MovieList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockMovies.map(movie => (
        <Card key={movie.id}>
          <CardHeader>
            <Image src={movie.smallImage} alt={movie.name} width={300} height={200} className="rounded-t-lg" />
          </CardHeader>
          <CardContent>
            <CardTitle>{movie.name} ({movie.year})</CardTitle>
            <CardDescription>{movie.genre} | {movie.duration} min</CardDescription>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Badge variant="secondary">IMDb: {movie.imdbRating}</Badge>
            <Badge variant="secondary">RT: {movie.rottenTomatoesRating}%</Badge>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

