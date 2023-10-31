import axios from "axios";

export default class CourseServices {
  /**
   * get courses from db
   * @param coursesPagination number of courses
   * @returns api response
   */
  public async getCourses(coursesPagination: string | number) {
    const { data } = await axios.get(`/api/courses?index=${coursesPagination}`);

    return data;
  }

  /**
   * Insert a course into database
   * @param title course's title
   * @param description course's description
   * @param date course's date
   * @param id_author owner's id
   * @param toLearn list of benefits
   * @param coverImage cover of course
   * @returns api response
   */
  public async publishCourse(
    title: string,
    description: string,
    date: string,
    id_author: string | number,
    toLearn: string[],
    coverFile: File
  ) {
    const benefitsList = JSON.stringify(toLearn);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("id_author", String(id_author));
    formData.append("toLearn", benefitsList);
    formData.append("coverFile", coverFile as any);

    const { data } = await useFetch("/api/courses", {
      method: "post",
      body: formData,
    });
    return data;
  }

  public async getCourseById(
    courseId: number | string
  ) {
    const { data } = await axios.get(
      `/api/courses/with-id/?courseId=${courseId}`
    );

    return data;
  }

  public async getUserCourse(
    courseId: number | string,
    userId: number | string
  ){
    const { data } = await axios.get(
      `/api/courses/user-course/?courseId=${courseId}&userId=${userId}`
    );

    return data;
  }
}
