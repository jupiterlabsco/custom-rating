import './globals.css'

export const metadata = {
  title: 'Custom Ratings Widget',
  description: 'Embeddable star rating system for service providers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}