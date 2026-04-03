// Navigation data - migrated from _data/navigation.yml

export interface NavItem {
  title: string;
  url: string;
}

export interface Navigation {
  main: {
    en: NavItem[];
    zh: NavItem[];
  };
}

export const navigation: Navigation = {
  main: {
    en: [
      { title: 'About Me', url: '/#about-me' },
      { title: 'Status', url: '/#status' },
      { title: 'Publications', url: '/#publications' },
      { title: 'Education', url: '/#educations' },
      { title: 'Honors', url: '/#honors' },
      { title: 'Project', url: '/#project' },
      { title: 'Skills', url: '/#skills' },
      { title: 'CV', url: '/cv' },
      { title: 'Works', url: '/works' },
    ],
    zh: [
      { title: '关于我', url: '/zh/#about-me' },
      { title: '状态', url: '/zh/#status' },
      { title: '发表论文', url: '/zh/#publications' },
      { title: '荣誉奖项', url: '/zh/#honors' },
      { title: '教育经历', url: '/zh/#educations' },
      { title: '项目', url: '/zh/#project' },
      { title: '技能', url: '/zh/#skills' },
      { title: '简历', url: '/zh/cv' },
      { title: '作品展示', url: '/works' },
    ],
  },
};
