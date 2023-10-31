export default interface CourseModel {
  id?: string;
  title: string;
  description: string;
  date: string;
  id_author: string | number;
  toLearn: string | any;
  coverUrl: string;
}
