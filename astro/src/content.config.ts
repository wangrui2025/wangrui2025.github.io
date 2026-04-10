import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const papers = defineCollection({
  loader: glob({ base: './src/content/papers', pattern: '**/*.json' }),
  schema: z.object({
    date: z.string().regex(/^\d{4}-\d{2}$/, 'Date must be YYYY-MM format'),
    venue: z.string(),
    venue_full: z.string(),
    tags: z.array(z.string()).optional(),
    image: z.string(),
    alt_zh: z.string(),
    alt_en: z.string(),
    arxiv: z.string().url().optional(),
    project: z.string().url().optional(),
    equal_contribution: z.boolean().optional(),
    show_on_cv: z.boolean().default(true),
    show_on_homepage: z.boolean().default(true),
    zh: z.object({
      title: z.string(),
      authors: z.array(z.object({
        name: z.string(),
        is_corresponding: z.boolean().default(false),
        is_self: z.boolean().default(false),
      })),
      fields: z.array(z.string()),
      technologies: z.array(z.string()),
    }),
    en: z.object({
      title: z.string(),
      authors: z.array(z.object({
        name: z.string(),
        is_corresponding: z.boolean().default(false),
        is_self: z.boolean().default(false),
      })),
      fields: z.array(z.string()),
      technologies: z.array(z.string()),
    }),
  }),
});

const scholar = defineCollection({
  loader: glob({ base: './src/content/scholar', pattern: '**/*.json' }),
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
    updated: z.string(),
    papers: z.record(z.string(), z.object({
      arxiv_id: z.string(),
      title: z.string(),
      citations: z.number(),
      authors: z.array(z.string()),
    })).optional(),
  }),
});

const honors = defineCollection({
  loader: glob({ base: './src/content/honors', pattern: '**/*.json' }),
  schema: z.object({
    graduate: z.array(z.object({
      period: z.string(),
      rank: z.number(),
      zh: z.object({ text: z.string() }),
      en: z.object({ text: z.string() }),
      show_on_cv: z.boolean().default(true),
      show_on_homepage: z.boolean().default(true),
    })),
    undergraduate: z.array(z.object({
      period: z.string(),
      rank: z.number(),
      zh: z.object({ text: z.string() }),
      en: z.object({ text: z.string() }),
      show_on_cv: z.boolean().default(true),
      show_on_homepage: z.boolean().default(true),
    })),
  }),
});

const education = defineCollection({
  loader: file('src/content/education/education.json'),
  schema: z.object({
    master: z.object({
      university: z.object({ zh: z.string(), en: z.string() }),
      universityUrl: z.object({ zh: z.string(), en: z.string() }),
      college: z.object({ zh: z.string(), en: z.string() }),
      collegeUrl: z.object({ zh: z.string(), en: z.string() }),
      major: z.object({ zh: z.string(), en: z.string() }),
      degree: z.object({ zh: z.string(), en: z.string() }),
      period: z.object({ zh: z.string(), en: z.string() }),
      detail: z.object({ zh: z.string(), en: z.string() }),
    }),
    bachelor: z.object({
      university: z.object({ zh: z.string(), en: z.string() }),
      universityUrl: z.object({ zh: z.string(), en: z.string() }),
      college: z.object({ zh: z.string(), en: z.string() }),
      collegeUrl: z.object({ zh: z.string(), en: z.string() }),
      major: z.object({ zh: z.string(), en: z.string() }),
      degree: z.object({ zh: z.string(), en: z.string() }),
      period: z.object({ zh: z.string(), en: z.string() }),
      detail: z.object({ zh: z.string(), en: z.string() }),
      examScores: z.object({ zh: z.string(), en: z.string() }).optional(),
    }),
  }),
});

const homepage = defineCollection({
  loader: glob({ base: './src/content/homepage', pattern: '**/*.json' }),
  schema: z.object({
    // SEO metadata
    title: z.string(),
    description: z.string(),
    // About section
    status_badge: z.string(),
    background: z.object({
      heading: z.string(),
      intro: z.string(), // HTML content
      research: z.string().optional(), // HTML content
      items: z.array(z.string()),
    }),
    target_areas: z.object({
      heading: z.string(),
      subheading: z.string(),
      items: z.array(z.string()),
    }),
    // News
    news_heading: z.string(),
    news_items: z.array(z.object({
      text: z.string(),
      url: z.string().nullable(),
    })),
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
    // Timeline
    timeline_heading: z.string(),
    timeline_collapsed_text: z.string(),
    timeline_expanded_text: z.string(),
    timeline_items: z.array(z.object({
      period: z.string(),
      title: z.string(),
      description: z.string().optional(),
      tags: z.array(z.string()).optional(),
    })),
  }),
});

export const collections = { papers, scholar, homepage, education, honors };
