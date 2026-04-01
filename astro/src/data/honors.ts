// Honors data - migrated from _data/honors.yml

export interface HonorItem {
  period: string;
  text: string;
}

export interface Honors {
  graduate: {
    zh: HonorItem[];
    en: HonorItem[];
  };
  undergraduate: {
    zh: HonorItem[];
    en: HonorItem[];
  };
}

export const honors: Honors = {
  graduate: {
    zh: [
      { period: '2026.01', text: '深圳大学学术启航奖学金' },
      { period: '2025.12', text: '研究生学业奖学金一等奖' },
      { period: '2025.09', text: '研究生国家奖学金' },
      { period: '2024.12', text: '研究生学业奖学金特等奖' },
    ],
    en: [
      { period: '2026.01', text: 'Shenzhen University Research Initiation Scholarship' },
      { period: '2025.12', text: 'Graduate Academic Scholarship — First Prize' },
      { period: '2025.09', text: 'National Graduate Scholarship' },
      { period: '2024.12', text: 'Graduate Academic Scholarship — Special Prize' },
    ],
  },
  undergraduate: {
    zh: [
      { period: '2022.12', text: '河南大学 · 校级三好学生、校级奖学金' },
    ],
    en: [
      { period: '2022.12', text: 'Merit Student and University-Level Scholarship, Henan University' },
    ],
  },
};