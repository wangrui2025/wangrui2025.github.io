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
      { title: 'News', url: '/#news' },
      { title: 'Publications', url: '/#publications' },
      { title: 'Honors and Awards', url: '/#honors' },
      { title: 'Educations', url: '/#educations' },
      { title: 'Project', url: '/#project' },
      { title: 'Skills', url: '/#skills' },
    ],
    zh: [
      { title: '关于我', url: '/zh/#about-me' },
      { title: '状态', url: '/zh/#status' },
      { title: '发表论文', url: '/zh/#publications' },
      { title: '荣誉奖项', url: '/zh/#honors' },
      { title: '教育经历', url: '/zh/#educations' },
      { title: '项目', url: '/zh/#project' },
      { title: '技能', url: '/zh/#skills' },
    ],
  },
};
