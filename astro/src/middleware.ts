import { education } from './data/education';

export const onRequest = ({ locals }, next) => {
  locals.education = education;
  return next();
};
