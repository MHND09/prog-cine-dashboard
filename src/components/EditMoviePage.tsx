import { initAdmin } from "@/config/firebase";
import { getFirestore } from "firebase-admin/firestore";
import { Movie } from '@/lib/definitions'
import { EditMovieForm } from './EditMovieForm'

export default async function EditMoviePage({ params }: { params: { movieId: string } }) {
    await initAdmin();
    const firestore = getFirestore()
    const movieId = params.movieId
    const movieDoc = firestore.doc(`movies/${movieId}`)
    const movieSnapshot = await movieDoc.get()
    if (!movieSnapshot.exists) {
        return <div>No such movie</div>
    }
    const movie = movieSnapshot.data() as Movie

    return (
        <div>
            <h1>Edit Movie</h1>
            <EditMovieForm movie={movie} movieId={movieId} />
        </div>
    )
}