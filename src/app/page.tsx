import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { clerkClient } from '@clerk/nextjs/server'
import { auth } from '@clerk/nextjs/server'

export default async function DashboardPage() {
  const {userId} = await auth();
  const client = await clerkClient();
  const user = await client.users.getUser(userId as string);
  let name = "";
  if(user.privateMetadata?.role =="admin"){ 
    name = "Admin"
  }
  else{
    name = user.username ?? "User";
    name = name.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  console.log(name);
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Welcome, {name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Movies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">15</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Showtimes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">23</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
