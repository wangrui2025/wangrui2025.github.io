// Education data - migrated from _data/education.yml

export interface EducationEntry {
  description: { zh: string; en: string };
  period: { zh: string; en: string };
}

export interface Education {
  master: EducationEntry;
  bachelor: EducationEntry;
}

export const education: Education = {
  master: {
    description: {
      zh: '深圳大学 计算机与软件学院 · 计算机科学与技术专业 · 24 级硕士 · 工学硕士',
      en: 'College of Computer Science and Software Engineering, Shenzhen University · Computer Science and Technology · Class of 2024 · Master of Engineering',
    },
    period: {
      zh: '2024.09 - 2027.06 (预计毕业)',
      en: '2024.09 - 2027.06 (Expected Graduation)',
    },
  },
  bachelor: {
    description: {
      zh: '河南大学 计算机与信息工程学院 · 数据科学与大数据技术专业 · 工学学士',
      en: 'School of Computer and Information Engineering, Henan University · Data Science and Big Data Technology · Bachelor of Engineering',
    },
    period: {
      zh: '2020.09 - 2024.06',
      en: '2020.09 - 2024.06',
    },
  },
};
