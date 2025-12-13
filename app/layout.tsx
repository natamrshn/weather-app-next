import { Providers } from './providers'
import BackgroundParticles from '@/components/BackgroundParticles/BackgroundParticles'
import './globals.scss'

export const metadata = {
  title: 'Weather Cities App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <BackgroundParticles />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

