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
      { period: '2025.12', text: '研究生国家奖学金' },
      { period: '2024.12', text: '深圳大学研究生学业奖学金特等奖' },
      { period: '2025.12', text: '深圳大学研究生学业奖学金一等奖' },
      { period: '2026.01', text: '深圳大学学术启航奖学金' },
    ],
    en: [
      { period: '2025.12', text: 'National Graduate Scholarship' },
      { period: '2024.12', text: 'Shenzhen University Graduate Academic Scholarship — Special Prize' },
      { period: '2025.12', text: 'Shenzhen University Graduate Academic Scholarship — First Prize' },
      { period: '2026.01', text: 'Shenzhen University Academic Launch Scholarship' },
    ],
  },
  undergraduate: {
    zh: [
      { period: '2022.12', text: '河南大学三好学生、河南大学奖学金' },
    ],
    en: [
      { period: '2022.12', text: 'Henan University Merit Student, Henan University Scholarship' },
    ],
  },
};