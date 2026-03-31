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
      { period: '2026.01', text: '2025年深圳大学学术启航奖学金' },
      { period: '2025.12', text: '2025-2026学年 深圳大学研究生学业奖学金（2024级硕士一等奖）' },
      { period: '2025.09', text: '2024-2025学年度 研究生国家奖学金' },
      { period: '2024.12', text: '2024-2025学年 深圳大学研究生学业奖学金（2024级硕士特等奖）' },
    ],
    en: [
      { period: '2026.01', text: '2025 Shenzhen University Research Initiation Scholarship' },
      { period: '2025.12', text: '2025-2026 Academic Year Shenzhen University Graduate Scholarship (First Class, 2024 Master\'s)' },
      { period: '2025.09', text: '2024-2025 Academic Year National Graduate Scholarship' },
      { period: '2024.12', text: '2024-2025 Academic Year Shenzhen University Graduate Scholarship (Highest Honors, 2024 Master\'s)' },
    ],
  },
  undergraduate: {
    zh: [
      { period: '2020.09 - 2024.06', text: '获评河南大学校级三好学生、校级奖学金（2021-2022学年）' },
    ],
    en: [
      { period: '2020.09 - 2024.06', text: 'Awarded Merit Student and University-Level Scholarship, Henan University (2021-2022 Academic Year)' },
    ],
  },
};