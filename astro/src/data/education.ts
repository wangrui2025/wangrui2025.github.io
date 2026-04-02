// Education data - migrated from _data/education.yml

export interface EducationEntry {
  university: { zh: string; en: string };
  universityUrl: { zh: string; en: string };
  college: { zh: string; en: string };
  collegeUrl: { zh: string; en: string };
  major: { zh: string; en: string };
  degree: { zh: string; en: string };
  period: { zh: string; en: string };
}

export interface Education {
  master: EducationEntry;
  bachelor: EducationEntry;
}

export const education: Education = {
  master: {
    university: {
      zh: '深圳大学',
      en: 'Shenzhen University',
    },
    universityUrl: {
      zh: 'https://www.szu.edu.cn/',
      en: 'https://www.szu.edu.cn/',
    },
    college: {
      zh: '计算机与软件学院',
      en: 'College of Computer Science and Software Engineering',
    },
    collegeUrl: {
      zh: 'https://csse.szu.edu.cn/',
      en: 'https://csse.szu.edu.cn/',
    },
    major: {
      zh: '计算机科学与技术专业',
      en: 'Computer Science and Technology',
    },
    degree: {
      zh: '工学硕士',
      en: 'Master of Engineering',
    },
    period: {
      zh: '2024.09 - 2027.06 (预计)',
      en: '2024.09 - 2027.06 (Expected)',
    },
  },
  bachelor: {
    university: {
      zh: '河南大学',
      en: 'Henan University',
    },
    universityUrl: {
      zh: 'https://www.henu.edu.cn/',
      en: 'https://www.henu.edu.cn/',
    },
    college: {
      zh: '计算机与信息工程学院',
      en: 'School of Computer and Information Engineering',
    },
    collegeUrl: {
      zh: 'https://cs.henu.edu.cn/',
      en: 'https://cs.henu.edu.cn/',
    },
    major: {
      zh: '数据科学与大数据技术专业',
      en: 'Data Science and Big Data Technology',
    },
    degree: {
      zh: '工学学士',
      en: 'Bachelor of Engineering',
    },
    period: {
      zh: '2020.09 - 2024.06',
      en: '2020.09 - 2024.06',
    },
  },
};
