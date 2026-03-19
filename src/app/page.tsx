import Hero from "~/components/Hero"
import { HydrateClient } from "~/trpc/server"

export default function Home() {
  return (
    <HydrateClient>
      <main className="bg-background min-h-screen">
        <Hero />
      </main>
    </HydrateClient>
  )
}
