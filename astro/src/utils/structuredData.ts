export function getPersonSchema(data: {
  name: string;
  url: string;
  email: string;
  affiliation: string;
  sameAs: string[];
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.name,
    url: data.url,
    email: `mailto:${data.email}`,
    sameAs: data.sameAs,
    description: data.description,
    alumniOf: {
      "@type": "CollegeOrUniversity",
      "name": data.affiliation
    }
  };
}
