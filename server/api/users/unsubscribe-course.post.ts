import supabaseClient from "~~/server/supabaseClient";

export default eventHandler(async (event) => {
  const { userId, courseId } = await readBody(event);

  const { data: userCourseData, error: userCourseError } = await supabaseClient
    .from("users_courses")
    .delete()
    .eq("id_user", userId)
    .eq("id_course", courseId);

  if (userCourseError) {
    return userCourseError.message;
  }

  return true;
});
