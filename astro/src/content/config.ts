import { defineCollection, z } from 'astro:content';

const papers = defineCollection({
  type: 'data',
  schema: z.object({
    venue: z.string(),
    venue_full: z.string(),
    image: z.string(),
    alt_zh: z.string(),
    alt_en: z.string(),
    arxiv: z.string().url().optional(),
    project: z.string().url().optional(),
    zh: z.object({
      title: z.string(),
      authors: z.string(),
      fields: z.array(z.string()),
      technologies: z.array(z.string()),
    }),
    en: z.object({
      title: z.string(),
      authors: z.string(),
      fields: z.array(z.string()),
      technologies: z.array(z.string()),
    }),
  }),
});

const scholar = defineCollection({
  type: 'data',
  schema: z.object({
    scholar_id: z.string(),
    name: z.string(),
    affiliation: z.string(),
    email_domain: z.string(),
    homepage: z.string(),
    interests: z.array(z.string()),
    citedby: z.number(),
    citedby5y: z.number(),
    hindex: z.number(),
    hindex5y: z.number(),
    i10index: z.number(),
    i10index5y: z.number(),
    cites_per_year: z.record(z.string(), z.number()),
    url_picture: z.string().url().optional(),
    updated: z.string(),
  }),
});

const homepage = defineCollection({
  type: 'data',
  schema: z.object({
    // SEO metadata
    title: z.string(),
    description: z.string(),
    // About section
    status_badge: z.string(),
    about_text: z.string().optional(), // HTML content (deprecated, use background.intro + background.research)
    background: z.object({
      heading: z.string(),
      intro: z.string(), // HTML content
      research: z.string(), // HTML content
      items: z.array(z.string()),
    }),
    target_areas: z.object({
      heading: z.string(),
      subheading: z.string(),
      items: z.array(z.string()),
    }),
    // News
    news_heading: z.string(),
    news_items: z.array(z.string()),
    // Section titles
    section_publications: z.string(),
    section_education: z.string(),
    section_honors: z.string(),
    section_skills: z.string(),
    skills_items: z.array(z.string()),
    section_project: z.string(),
    // Project
    project_title: z.string(),
    project_description: z.string(),
    project_url: z.string(),
    // Honors headers
    honors_graduate_header: z.string(),
    honors_undergraduate_header: z.string(),
  }),
});

export const collections = { papers, scholar, homepage };
