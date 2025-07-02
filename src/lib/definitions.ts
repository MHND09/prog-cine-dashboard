export type Movie={
    id?: string
    name: string
    year: string
    bigImage: string
    smallImage: string
    description: string
    genre: string
    duration: string
    imdbRating: string
    rottenTomatoesRating: string
}
export interface imdbMovieResponse {
    Title: string
    Year: string
    Runtime: string
    Genre: string
    Plot: string
    Poster: string
    Ratings: {
        Source: string
        Value: string
    }[]
}
export type Showtime = {
    id: string
    date: Date
    movieId: string
    startTime: Date
    theaterId: string
    movieTitle: string
}