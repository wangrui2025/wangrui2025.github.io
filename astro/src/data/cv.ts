// CV data - unified source for both languages

export interface CVAuthor {
  name: string;
  isSelf: boolean;
}

export interface CVPublication {
  title: string;
  conference: string;
  authors: CVAuthor[];
  arxiv?: string;
  projectUrl?: string;
}

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
    birth: string;
    gender: string;
  };
  education: {
    master: {
      university: string;
      major: string;
      college: string;
      detail: string;
      period: string;
      examScores: string | null;
    };
    bachelor: {
      university: string;
      major: string;
      college: string;
      detail: string;
      period: string;
      examScores: string | null;
    };
  };
  publications: CVPublication[];
  researchDirections: string[];
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
    education: {
      master: {
        university: '深圳大学',
        major: '计算机科学与技术 硕士 · 计算机与软件学院',
        college: '',
        detail: '导师：吴惠思教授 · 研究方向：超声心动图视频分割',
        period: '2024.09 - 2027.06 (预计)',
        examScores: null,
      },
      bachelor: {
        university: '河南大学',
        major: '数据科学与大数据技术 本科 · 计算机与信息工程学院',
        college: '',
        detail: '平均学分绩点 3.19/4 | 排名: 15/128 (前11%)',
        period: '2020.09 - 2024.06',
        examScores: 'CET-4: 548 | CET-6: 435',
      },
    },
    publications: [
      {
        title: 'OSA: Echocardiography Video Segmentation via Orthogonalized State Update and Anatomical Prior-aware Feature Enhancement',
        conference: 'CVPR 2026',
        authors: [
          { name: '王锐', isSelf: true },
          { name: '吴惠思', isSelf: false },
          { name: '秦璟', isSelf: false },
        ],
        arxiv: 'https://arxiv.org/pdf/2603.26188',
      },
      {
        title: 'GDKVM: Echocardiography Video Segmentation via Spatiotemporal Key-Value Memory with Gated Delta Rule',
        conference: 'ICCV 2025',
        authors: [
          { name: '王锐', isSelf: true },
          { name: '孙一木', isSelf: false },
          { name: '郭警醒', isSelf: false },
          { name: '吴惠思', isSelf: false },
          { name: '秦璟', isSelf: false },
        ],
        arxiv: 'https://arxiv.org/pdf/2512.10252',
        projectUrl: 'https://wangrui2025.github.io/GDKVM/',
      },
    ],
    researchDirections: [
      '高效神经网络架构设计',
      '非凸优化 / 几何深度学习',
      '计算机视觉长程依赖建模',
      '大规模多模态预训练',
      '视觉-语言模型推理效率优化',
    ],
    honors: [
      { text: '研究生国家奖学金', period: '2025.12' },
      { text: '深圳大学研究生学业奖学金一等奖', period: '2025.12' },
      { text: '深圳大学研究生学业奖学金特等奖', period: '2024.12' },
      { text: '深圳大学学术启航奖学金', period: '2026.01' },
      { text: '河南大学三好学生及奖学金', period: '2022.12' },
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
    education: {
      master: {
        university: 'Shenzhen University',
        major: 'Computer Science and Technology (M.S.) · College of Computer Science and Software Engineering',
        college: '',
        detail: 'Advisor: Prof. Wu Huisi · Research: Echocardiography Video Segmentation',
        period: '2024.09 - 2027.06 (Expected)',
        examScores: null,
      },
      bachelor: {
        university: 'Henan University',
        major: 'Data Science and Big Data Technology (B.Eng.) · School of Computer and Information Engineering',
        college: '',
        detail: 'Kaifeng | GPA: 3.45/4 | Rank: 15/128 (Top 11%)',
        period: '2020.09 - 2024.06',
        examScores: 'CET-4: 548 | CET-6: 435',
      },
    },
    publications: [
      {
        title: 'OSA: Echocardiography Video Segmentation via Orthogonalized State Update and Anatomical Prior-aware Feature Enhancement',
        conference: 'CVPR 2026',
        authors: [
          { name: 'Rui Wang', isSelf: true },
          { name: 'Huisi Wu', isSelf: false },
          { name: 'Jing Qin', isSelf: false },
        ],
        arxiv: 'https://arxiv.org/pdf/2603.26188',
      },
      {
        title: 'GDKVM: Echocardiography Video Segmentation via Spatiotemporal Key-Value Memory with Gated Delta Rule',
        conference: 'ICCV 2025',
        authors: [
          { name: 'Rui Wang', isSelf: true },
          { name: 'Yimu Sun', isSelf: false },
          { name: 'Jingxing Guo', isSelf: false },
          { name: 'Huisi Wu', isSelf: false },
          { name: 'Jing Qin', isSelf: false },
        ],
        arxiv: 'https://arxiv.org/pdf/2512.10252',
        projectUrl: 'https://wangrui2025.github.io/GDKVM/',
      },
    ],
    researchDirections: [
      'Efficient Neural Architecture Design',
      'Non-convex Optimization / Geometric Deep Learning',
      'Long-range Dependency Modeling in Computer Vision',
      'Large-scale Multimodal Pre-training',
      'Vision-Language Model Inference Efficiency',
    ],
    honors: [
      { text: 'National Graduate Scholarship', period: '2025.12' },
      { text: 'Shenzhen University Graduate Academic Scholarship — First Prize', period: '2025.12' },
      { text: 'Shenzhen University Graduate Academic Scholarship — Special Prize', period: '2024.12' },
      { text: 'Shenzhen University Academic Launch Scholarship', period: '2026.01' },
      { text: 'Henan University Merit Student and Scholarship', period: '2022.12' },
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
