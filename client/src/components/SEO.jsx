// client/src/components/SEO.jsx

import { Helmet } from 'react-helmet-async';

const defaultSEO = {
  title: 'ProjectFlow',
  description:
    'AI-powered project management for developers. Break down projects into phases, get AI task suggestions, and generate PRD documents automatically.',
  keywords:
    'project management, developer tools, AI, task management, PRD generator, software development',
  image: '/og-image.png', // Create this image (1200x630px)
  url: 'https://projectflow.netlify.app', // Update with your actual domain
};

function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  noIndex = false,
}) {
  const seo = {
    title: title ? `${title} | ProjectFlow` : defaultSEO.title,
    description: description || defaultSEO.description,
    keywords: keywords || defaultSEO.keywords,
    image: image || defaultSEO.image,
    url: url || defaultSEO.url,
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seo.title}</title>
      <meta name='description' content={seo.description} />
      <meta name='keywords' content={seo.keywords} />

      {/* Robots */}
      {noIndex && <meta name='robots' content='noindex, nofollow' />}

      {/* Open Graph / Facebook */}
      <meta property='og:type' content={type} />
      <meta property='og:url' content={seo.url} />
      <meta property='og:title' content={seo.title} />
      <meta property='og:description' content={seo.description} />
      <meta property='og:image' content={seo.image} />

      {/* Twitter */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:url' content={seo.url} />
      <meta name='twitter:title' content={seo.title} />
      <meta name='twitter:description' content={seo.description} />
      <meta name='twitter:image' content={seo.image} />

      {/* Canonical URL */}
      <link rel='canonical' href={seo.url} />
    </Helmet>
  );
}

export default SEO;
