import '../globals.css'

export const metadata = {
  title: 'Rating Widget',
  description: 'Embeddable rating widget',
}

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            body { 
              margin: 0; 
              padding: 0; 
              background: transparent;
              overflow: hidden;
            }
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  )
}