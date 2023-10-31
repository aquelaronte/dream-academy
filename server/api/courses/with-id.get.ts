import supabaseClient from "~~/server/supabaseClient";

export default eventHandler(async (event) => {
  const { courseId } = getQuery(event);

  const { data: courseData, error: courseError } = await supabaseClient
    .from("courses")
    .select("*")
    .eq("id", courseId);

  if (courseError) {
    return courseError.message;
  }

  const { data: authorData, error: authorError } = await supabaseClient
    .from("users")
    .select("name")
    .eq("id", courseData[0].id_author);

  if (authorError) {
    return authorError.message;
  }

  const course = courseData[0];

  const coverUrl = supabaseClient.storage
    .from("courses-covers")
    .getPublicUrl(course.coverUrl);

  const response = {
    ...course,
    cover: coverUrl.data.publicUrl,
    toLearn: JSON.parse(course.toLearn),
    author: authorData[0].name,
  };

  return response;
});
