import CourseModel from "~/models/courseModel";
import UserModel from "~/models/userModel";
import supabaseClient from "~~/server/supabaseClient";

export default eventHandler(async (event) => {
  const { pagination } = getQuery(event);

  const { data: coursesData, error: coursesError } = await supabaseClient
    .from("courses")
    .select("*, users ( * )");

  if (coursesError) {
    return coursesError.message;
  }

  let response = <Array<CourseModel & { author: string; cover: string }>>[];

  coursesData.forEach((course: CourseModel & { users: UserModel }) => {
    const coverUrl = supabaseClient.storage
      .from("courses-covers")
      .getPublicUrl(course.coverUrl);

    response.push({
      id: course.id,
      author: course.users.name,
      coverUrl: course.coverUrl,
      cover: coverUrl.data.publicUrl,
      title: course.title,
      description: course.description,
      date: course.date,
      id_author: course.id_author,
      toLearn: JSON.parse(course.toLearn),
    });
  });

  return response
});
