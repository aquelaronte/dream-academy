import supabaseClient from "~~/server/supabaseClient";

export default eventHandler(async (event) => {
  const { courseId, userId } = getQuery(event);

  const { data: userCourseData, error: userCourseError } = await supabaseClient
    .from("users_courses")
    .select("*")
    .eq("id_user", userId)
    .eq("id_course", courseId);

  if (userCourseError) {
    return userCourseError.message;
  }

  const isUserSuscribed = userCourseData.length > 0;

  const response = {
    suscribed: isUserSuscribed,
    owner: isUserSuscribed && userCourseData[0].owner
  };

  return response;
});
