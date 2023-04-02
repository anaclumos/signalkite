import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'edge',
}

export default function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const hasTitle = searchParams.has('title')
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'The Latest Tech News 🗞️ in Your Language 💬 in Your Inbox 📭'

    const hasSubheading = searchParams.get('subheading')?.slice(0, 100)
    const subheading = hasSubheading ? searchParams.get('subheading') : 'hn.cho.sh'

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            padding: '20px 150px',
            justifyContent: 'center',
            fontFamily: 'Inter, "Fluent Emoji"',
            fontSize: 80,
            backgroundColor: 'white',
            flexDirection: 'column',
            backgroundColor: '#c5daec',
            backgroundImage: 'linear-gradient(9, #c5daec 0%, #ffffff 80%)',
            letterSpacing: -3,
            fontWeight: 900,
            wordWrap: 'break-word',
            wordBreak: 'keep-all',
          }}
        >
          <div
            style={{
              fontSize: 50,
              color: 'gray',
              margin: '20px 0',
            }}
          >
            {subheading}
          </div>
          <div>{title}</div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
