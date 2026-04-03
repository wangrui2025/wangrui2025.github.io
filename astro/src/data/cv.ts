// CV data - unified source for both languages
// NOTE: education, publications, honors are now managed via Content Collections in src/content/
// This file now only contains: personal, researchDirections, projects, skills, hobbies

export interface CVSkill {
  category: string;
  items: string;
}

export interface CVProject {
  name: string;
  type: string;
  description: string;
  url?: string;
}

export interface CVData {
  personal: {
    name: string;
    phone: string;
    location: string;
    gender: string;
  };
  researchDirections: string[];
  // Honors kept here for competition awards (CCF-CSP, 蓝桥杯, etc.) not in content collections
  honors: Array<{ text: string; period: string; secondary?: boolean }>;
  projects: CVProject[];
  skills: CVSkill[];
  hobbies: string[];
}

export const cvData: Record<'zh' | 'en', CVData> = {
  zh: {
    personal: {
      name: '王锐',
      phone: '15938550910',
      location: '深圳',
      gender: '男（he/him）',
    },
    researchDirections: [
      '高效神经网络架构设计',
      '非凸优化 / 几何深度学习',
      '计算机视觉长程依赖建模',
      '大规模多模态预训练',
      '视觉-语言模型推理效率优化',
    ],
    // Competition awards not in content collections
    honors: [
      { text: 'CCF-CSP认证 — 170分（前28%）', period: '2022.03', secondary: true },
      { text: '第十三届蓝桥杯C/C++程序设计组 — 省三等奖', period: '2022.05', secondary: true },
      { text: '第十六届中国大学生计算机设计大赛 — 省三等奖', period: '2023.05', secondary: true },
      { text: '第十六届"挑战杯"大学生课外学术科技作品竞赛 — 省三等奖', period: '2023.08', secondary: true },
      { text: '第九届中国"互联网+"大学生创新创业大赛 — 省三等奖', period: '2023.08', secondary: true },
    ],
    projects: [
      {
        name: 'how2research',
        type: '开源项目',
        description: '面向研究生的开源科研指南。涵盖 CVPR/ICCV 投稿流程、高效 LaTeX 写作技巧、科研 Prompt 工程及开发环境配置（uv, VSCode）等。由 "miyuki11" 维护。',
        url: 'https://github.com/miyuki11/how2research',
      },
    ],
    skills: [
      { category: '编程语言', items: 'Python, C/C++, SQL, JavaScript' },
      { category: '深度学习', items: 'PyTorch, TensorFlow, 医学影像分析' },
      { category: '开发工具', items: 'Git, Linux, Docker, VS Code, PyCharm' },
      { category: '科研工具', items: 'Claude Code, Harness Engineering, LaTeX' },
    ],
    hobbies: ['排球', '棒垒球', '书法'],
  },
  en: {
    personal: {
      name: 'Rui Wang',
      phone: '15938550910',
      location: 'Shenzhen',
      gender: 'Male（he/him）',
    },
    researchDirections: [
      'Efficient Neural Architecture Design',
      'Non-convex Optimization / Geometric Deep Learning',
      'Long-range Dependency Modeling in Computer Vision',
      'Large-scale Multimodal Pre-training',
      'Vision-Language Model Inference Efficiency',
    ],
    // Competition awards not in content collections
    honors: [
      { text: 'CCF-CSP Certification — 170 points (Top 28%)', period: '2022.03', secondary: true },
      { text: '13th Lanqiao Cup C/C++ Programming (Provincial Third Prize)', period: '2022.05', secondary: true },
      { text: '16th China Undergraduate Computer Design Competition (Provincial Third Prize)', period: '2023.05', secondary: true },
      { text: '16th "Challenge Cup" Undergraduate Academic Science & Technology Competition (Provincial Third Prize)', period: '2023.08', secondary: true },
      { text: '9th China "Internet+" College Student Innovation & Entrepreneurship Competition (Provincial Third Prize)', period: '2023.08', secondary: true },
    ],
    projects: [
      {
        name: 'how2research',
        type: 'Open Source',
        description: 'An open-source research guide for graduate students, covering CVPR/ICCV submission processes, efficient LaTeX writing tips, research prompt engineering, and development environment setup (uv, VSCode). Maintained by "miyuki11".',
        url: 'https://github.com/miyuki11/how2research',
      },
    ],
    skills: [
      { category: 'Programming', items: 'Python, C/C++, SQL, JavaScript' },
      { category: 'Deep Learning', items: 'PyTorch, TensorFlow, Medical Image Analysis' },
      { category: 'Dev Tools', items: 'Git, Linux, Docker, VS Code, PyCharm' },
      { category: 'Research Tools', items: 'Claude Code, Harness Engineering, LaTeX' },
    ],
    hobbies: ['Volleyball', 'Baseball/Softball', 'Calligraphy'],
  },
};
