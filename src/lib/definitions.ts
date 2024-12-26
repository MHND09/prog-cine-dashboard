export type Movie={
    id: string
    name: string
    year: number
    bigImage: string
    smallImage: string
    description: string
    genre: string
    duration: number
    imdbRating: number
    rottenTomatoesRating: number
}

export type Showtime = {
    id: string
    date: Date
    movieId: string
    startTime: Date
    theaterId: string
    movieTitle: string
}