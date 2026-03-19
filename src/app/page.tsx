import Hero from "~/components/Hero"
import NewsSection from "~/components/NewsSection"
import { HydrateClient } from "~/trpc/server"

export default function Home() {
  return (
    <HydrateClient>
      <main className="bg-background min-h-screen">
        <Hero />
        <NewsSection />
      </main>
    </HydrateClient>
  )
}
