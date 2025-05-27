// app/sitemap.ts
import { type MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/playlist`,
      lastModified: new Date(),
    },
	{
		url: `${baseUrl}/like`,
		lastModified: new Date(),
	},
    {
      url: `${baseUrl}/upload`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
    },
  ]
}
