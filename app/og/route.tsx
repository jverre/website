import { ImageResponse } from 'next/og'

export function GET(request: Request) {
  let url = new URL(request.url)
  let title = url.searchParams.get('title') || 'Jacques Verré'
  let summary = url.searchParams.get('summary') || ''

  return new ImageResponse(
    (
      <div
        tw="flex flex-col w-full h-full bg-white"
        style={{ padding: '60px 80px' }}
      >
        <div tw="flex flex-col flex-1 justify-center">
          <h1
            tw="text-6xl font-bold tracking-tight text-black leading-tight"
            style={{ lineHeight: 1.2 }}
          >
            {title}
          </h1>
          {summary && (
            <p tw="text-2xl text-gray-500 mt-4" style={{ lineHeight: 1.5 }}>
              {summary}
            </p>
          )}
        </div>
        <div tw="flex items-center justify-between w-full">
          <span tw="text-xl text-gray-400">jacquesverre.com</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
