import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { AddShowtimeForm } from "@/components/AddShowtimeForm"
import { clerkClient, auth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";
import { Movie } from "@/lib/definitions";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

async function getTheaterId() {
    const { userId } = await auth();
    const client = await clerkClient();
    const user = await client.users.getUser(userId as string);
    const theaterId = typeof user.privateMetadata?.theater_id === 'string' ? user.privateMetadata.theater_id : process.env.DEFAULT_THEATER_ID as string;
    return theaterId;
}
async function getMovies() {
    const supabase = await createClient();
    const { data: movies, error } = await supabase
        .from('movie')
        .select('*') as { data: Movie[], error: any }
    if (error) {
        return { error: error, movies: null }
    }
    return { error: null, movies: movies }
}

export default async function AddShowtimePage() {
    try {
        const theaterId = await getTheaterId();
        const { error, movies } = await getMovies();
        if (error || movies === null) {
            return (
                <div className="w-full min-h-screen p-8 bg-gray-50">
                    <div className="mx-auto space-y-8">
                        <Alert variant="destructive" className="mt-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>There Was An Error Loading Movies</AlertTitle>
                            <AlertDescription>if you think this happened by mistake, please contact your administrator.</AlertDescription>
                        </Alert>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="w-full min-h-screen p-8 bg-gray-50">
                    <div className="mx-auto space-y-8">
                        <h1 className="text-3xl font-bold text-center mb-4">Add Showtime</h1>
                        <Tabs defaultValue="addOne">
                            <TabsList className="mb-6 flex justify-center w-auto">
                                <TabsTrigger value="addOne">Add One</TabsTrigger>
                                <TabsTrigger value="addMany">Add Many</TabsTrigger>
                            </TabsList>
                            <TabsContent value="addOne" className="space-y-4">
                                <h2 className="text-xl font-semibold">Add a Single Showtime</h2>
                                <AddShowtimeForm movies={movies} theaterId={theaterId} />
                            </TabsContent>
                            <TabsContent value="addMany" className="space-y-6">
                                <h2 className="text-xl font-semibold">Add Multiple Showtimes</h2>
                                <p className="text-gray-500 text-center">Coming soon...</p>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>)
        }
    } catch (error) {
        console.log("hello from error")
        console.log("error ", error)
    }
}