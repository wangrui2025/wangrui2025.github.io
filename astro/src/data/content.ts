// Content data - migrated from _data/content.yml

export interface Content {
  status_badge: {
    zh: string;
    en: string;
  };
  background: {
    heading: { zh: string; en: string };
    items: { zh: string[]; en: string[] };
  };
  target_areas: {
    heading: { zh: string; en: string };
    subheading: { zh: string; en: string };
    items: { zh: string[]; en: string[] };
  };
  status: {
    heading: { zh: string; en: string };
    items: { zh: string[]; en: string[] };
  };
  section_titles: {
    publications: { zh: string; en: string };
    honors: { zh: string; en: string };
    education: { zh: string; en: string };
    project: { zh: string; en: string };
  };
  projects: {
    how2research: {
      zh: { title: string; description: string };
      en: { title: string; description: string };
      url: string;
    };
  };
  honors_headers: {
    graduate: { zh: string; en: string };
    undergraduate: { zh: string; en: string };
  };
}

export const content: Content = {
  status_badge: {
    zh: '🎓 申博中 · 2027 Fall 入学',
    en: '🎓 Applying for PhD Programs · Fall 2027 Entry',
  },
  background: {
    heading: {
      zh: '研究背景',
      en: 'Background',
    },
    items: {
      zh: [
        '高效神经网络架构设计',
        '非凸优化 / 几何深度学习',
        '计算机视觉中的长程依赖建模',
      ],
      en: [
        'Efficient NN Architectures',
        'Non-convex Optimization / Geometric DL',
        'Long-range Dependencies in CV',
      ],
    },
  },
  target_areas: {
    heading: {
      zh: '目标方向',
      en: 'Research Directions',
    },
    subheading: {
      zh: '（正在转向）',
      en: '(Transitioning to)',
    },
    items: {
      zh: [
        '大规模多模态预训练',
        '视觉-语言模型推理效率优化',
        '开放方向：通用计算机视觉、机器学习系统',
      ],
      en: [
        'Large-scale Multimodal Pretraining',
        'Inference-time Efficiency for VLMs',
        'Also interested in: General Computer Vision, ML Systems',
      ],
    },
  },
  status: {
    heading: {
      zh: '🔥 状态',
      en: '🔥 Status',
    },
    items: {
      zh: ['🔥 正在准备 CVPR Poster 中'],
      en: ['🔥 Preparing CVPR Poster'],
    },
  },
  section_titles: {
    publications: {
      zh: '📝 发表论文',
      en: '📝 Publications',
    },
    honors: {
      zh: '🎖 荣誉奖项',
      en: '🎖 Honors and Awards',
    },
    education: {
      zh: '📖 教育经历',
      en: '📖 Education',
    },
    project: {
      zh: '🚀 Project',
      en: '🚀 Project',
    },
  },
  projects: {
    how2research: {
      zh: {
        title: 'how2research (研究生修炼指北)',
        description:
          '一个面向研究生的开源科研指南，涵盖 CVPR/ICCV 投稿流程、高效 LaTeX 写作技巧、科研 Prompt 工程以及实验环境配置（如 uv, VSCode）等实用经验。',
      },
      en: {
        title: 'how2research (研究生修炼指北)',
        description:
          'An open-source research guide for graduate students, covering CVPR/ICCV submission processes, efficient LaTeX writing tips, research prompt engineering, and development environment setup (e.g., uv, VSCode).',
      },
      url: 'https://how2research-apple.notion.site/297e9f718aff81338d15e6347d75c807?v=297e9f718aff81099a35000cf7f4d545',
    },
  },
  honors_headers: {
    graduate: {
      zh: 'Graduate Period（深圳大学 计算机科学与技术专业）',
      en: 'Graduate Studies (Shenzhen University, Computer Science and Technology)',
    },
    undergraduate: {
      zh: 'Undergraduate Period（河南大学）',
      en: 'Undergraduate Studies (Henan University)',
    },
  },
};
