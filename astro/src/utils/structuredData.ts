export function getPersonSchema(data: {
  name: string;
  url: string;
  email: string;
  affiliation: string;
  sameAs: string[];
  description: string;
  jobTitle?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://wangrui2025.github.io/#person",
    name: data.name,
    url: data.url,
    jobTitle: data.jobTitle ?? "M.S. Candidate",
    email: `mailto:${data.email}`,
    description: data.description,
    affiliation: {
      "@type": "CollegeOrUniversity",
      "name": data.affiliation,
      "url": "https://en.szu.edu.cn"
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      "name": data.affiliation
    },
    sameAs: data.sameAs
  };
}

export function getPublicationsSchema(papers: Array<{
  id: string;
  date: string;
  venue: string;
  venue_full: string;
  title: string;
  authors: Array<{ name: string; is_self?: boolean }>;
  arxiv?: string;
  project?: string;
}>, siteUrl: string) {
  // ItemList schema for all publications listed on homepage
  const itemListElement = papers.map((_paper, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "url": `${siteUrl.replace(/\/$/, '')}/#publications`
  }));

  const publications = papers.map((paper) => {
    const authorPersons = paper.authors.map((author) => ({
      "@type": "Person",
      "name": author.name,
      ...(author.is_self ? { "url": `${siteUrl.replace(/\/$/, '')}/#person` } : {})
    }));

    return {
      "@type": "ScholarlyArticle",
      "@id": `${siteUrl.replace(/\/$/, '')}/#publication-${paper.id}`,
      "name": paper.title,
      "url": paper.project ?? paper.arxiv ?? `${siteUrl.replace(/\/$/, '')}/#publications`,
      "datePublished": paper.date,
      "dateline": paper.venue,
      "description": `${paper.venue_full} — ${paper.authors.map((a) => a.name).join(', ')}`,
      "author": authorPersons,
      ...(paper.arxiv ? { "identifier": paper.arxiv } : {})
    };
  });

  return [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Publications",
      "description": "Academic publications by Rui Wang",
      "url": `${siteUrl.replace(/\/$/, '')}/#publications`,
      "numberOfItems": papers.length,
      "itemListElement": itemListElement
    },
    ...publications
  ];
}
