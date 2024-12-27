import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Movie } from '@/lib/definitions'
import Link from 'next/link'



export function  MovieList({ movieList }: { movieList: Movie[] }) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {movieList.map(movie => (
        <Link href={`/movies?edit=${movie.id}`} key={movie.id} className="cursor-pointer">
        <Card key={movie.id}>
          <CardHeader>
            <Image src={movie?.smallImage} alt={movie?.name} width={300} height={200} className="rounded-t-lg" />
          </CardHeader>
          <CardContent>
            <CardTitle>{movie?.name} ({movie?.year})</CardTitle>
            <CardDescription>{movie?.genre} | {movie?.duration} min</CardDescription>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Badge variant="secondary">IMDb: {movie?.imdbRating}</Badge>
            <Badge variant="secondary">RT: {movie?.rottenTomatoesRating}%</Badge>
          </CardFooter>
        </Card>
        </Link>
      ))}
    </div>
  )
}


