import { Card, CardContent } from "@/components/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from "@/components/carousel"
import { cn } from "@/lib/utils"
import { Shuffle } from "lucide-react"
import { useEffect, useState } from "react"

const randomTlinkUrls = [
  "https://x.com/TantanFu122765/status/1846745075990385046",
  "https://x.com/TantanFu122765/status/1848263837633667126",
  "https://x.com/TantanFu122765/status/1847041906045604158",
  "https://x.com/TantanFu122765/status/1846783496909717594"
]

const openRandomTlink = () => {
  const randomUrl =
    randomTlinkUrls[Math.floor(Math.random() * randomTlinkUrls.length)]

  chrome.tabs.create({ url: randomUrl })
}

export function Preview() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const slides = [
    {
      title: "What is tlink",
      description:
        "Tlink is the link of tapps that can be transformed into interactive UIs on twitter",
      image: "https://tlink-web.vercel.app/preview-1.png",
      alt: "tlink concept illustration"
    },
    {
      title: "How to experience",
      description:
        "Visit x.com, tlink extension will be automatically activated when a tweet contains a tlink",
      image: "https://tlink-web.vercel.app/preview-2.png",
      alt: "x.com website screenshot"
    },
    {
      title: "Tlink example",
      description:
        "Click the button below to open an x.com tweet link and experience the magic of tlink.",
      image: "https://tlink-web.vercel.app/preview-3.png",
      alt: "tlink example screenshot"
    }
  ]

  return (
    <div className="w-full">
      <Carousel
        className="w-full max-w-[360px] mx-auto"
        setApi={setApi}
        opts={{
          align: "center",
          loop: true
        }}>
        <CarouselContent className="-ml-2 md:-ml-4">
          {slides.map((slide, index) => (
            <CarouselItem
              key={index}
              className="pl-2 md:pl-4 basis-4/5  transition-opacity duration-300 ease-in-out">
              <div
                className={cn(
                  "h-full",
                  current === index ? "opacity-100" : "opacity-50 scale-95"
                )}>
                <Card>
                  <CardContent className="flex flex-col items-center p-6">
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      width={300}
                      height={200}
                      className="rounded-lg mb-4"
                    />
                    <h2 className="text-xl font-semibold mb-2">
                      {slide.title}
                    </h2>
                    <p className="text-sm text-center text-muted-foreground mb-4">
                      {slide.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="flex justify-center mt-4 space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              current === index ? "bg-primary" : "bg-gray-200"
            }`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          onClick={openRandomTlink}
          className="flex items-center gap-2 text-white">
          <Shuffle className="w-4 h-4" />
          Try Random tlink
        </Button>
      </div>
    </div>
  )
}
