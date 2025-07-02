import { createClient } from "@/utils/supabase/server"


async function supabasetest(): Promise<any> {
    /* const supabase = await createClient()
    const now =  new Date()
    console.log("now", now.toISOString())
    const { data, error } = await supabase
    .from('schedule')
    .select('id, startTime, theaterId, date, movie!inner(id, name) ')
    .gte('startTime', now.toISOString())
    console.log("data", data)
    console.log("error", error)
    return data */
     const start = new Date('2025-02-06T16:30:00+00:00')
     console.log(start)
}


const   page =async () => {
    await supabasetest();
  return (
    <div>page</div>
  )
}

export default page