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
    "@id": "https://wangrui2025.github.io/#person",
    name: data.name,
    url: data.url,
    email: `mailto:${data.email}`,
    sameAs: data.sameAs,
    description: data.description,
    knowsAbout: data.affiliation
  };
}
