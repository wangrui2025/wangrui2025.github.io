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
  researchDirections: Array<{ main: string; sub?: string }>;
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
      { main: '高效序列建模与线性注意力机制', sub: '线性键值关联 / 门控 Delta 规则 / 长程时序依赖建模 / 实时视频理解' },
      { main: '几何深度学习与流形优化', sub: '正交化状态更新 / Stiefel 流形约束 / Newton-Schulz 迭代 / 秩崩塌抑制' },
      { main: '医学影像时空分析', sub: '超声心动图视频分割 / 心脏非刚性形变建模 / 散斑噪声鲁棒性 / 临床实时诊断系统' },
      { main: '非凸优化与动态系统', sub: '递归状态空间的几何正则化 / 记忆机制的可微优化 / 物理先验驱动的特征增强' },
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
        description: '面向研究生的开源科研指南。涵盖计算机会议投稿流程、高效 LaTeX 写作技巧、科研 Prompt 工程及开发环境配置（uv, VSCode）等。本人以 "miyuki11" 的身份维护。',
        url: 'https://how2research-apple.notion.site/858e9f718aff8270806e81385f3d6a69?v=707e9f718aff828ab4df08eb2a69c945',
      },
    ],
    skills: [
      { category: '编程语言', items: 'Python, C/C++' },
      { category: '深度学习', items: 'PyTorch' },
      { category: '开发工具', items: 'Git, VS Code' },
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
      { main: 'Efficient Sequence Modeling & Linear Attention', sub: 'Linear Key-Value / Gated Delta / Long-range Temporal / Real-time Video Understanding' },
      { main: 'Geometric Deep Learning & Manifold Optimization', sub: 'Orthogonalized State Update / Stiefel Manifold / Newton-Schulz / Matrix Manifold Learning / Rank Collapse Mitigation' },
      { main: 'Spatiotemporal Medical Image Analysis', sub: 'Echocardiography Video Segmentation / Cardiac Non-rigid Deformation / Speckle Noise / Clinical Real-time Diagnostics' },
      { main: 'Non-convex Optimization & Dynamical Systems', sub: 'Geometric Regularization / Differentiable Memory Optimization / Anatomical Prior-aware Feature Enhancement' },
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
        description: 'An open-source research guide for graduate students, covering conference submission processes, efficient LaTeX writing tips, research prompt engineering, and development environment setup (uv, VSCode). Maintained by "miyuki11".',
        url: 'https://how2research-apple.notion.site/858e9f718aff8270806e81385f3d6a69?v=707e9f718aff828ab4df08eb2a69c945',
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
