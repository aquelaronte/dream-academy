import CourseModel from "~/models/courseModel";
import supabaseClient from "~~/server/supabaseClient";

export default eventHandler(async (event) => {
  const { id } = getQuery(event);

  const { data: coursesData, error: coursesError } = await supabaseClient
    .from("courses")
    .select("*")
    .eq("id_author", `${id}`);

  if (coursesError) {
    return coursesError.message;
  }

  const response: CourseModel[] = [];

  for await (const course of coursesData) {
    const coverUrl = supabaseClient.storage
      .from("courses-covers")
      .getPublicUrl(course.coverUrl);

    response.push({
      id: course.id,
      title: course.title,
      description: course.description,
      date: course.date,
      id_author: course.id_author,
      toLearn: JSON.parse(course.toLearn),
      coverUrl: coverUrl.data.publicUrl,
    });
  }

  return response;
});
