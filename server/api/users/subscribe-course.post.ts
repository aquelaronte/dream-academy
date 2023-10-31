import supabaseClient from "~~/server/supabaseClient";

export default eventHandler(async (event) => {
  const { userId, courseId } = await readBody(event);

  const { data: userCourseData, error: userCourseError } = await supabaseClient
    .from("users_courses")
    .insert({
      id_user: userId,
      id_course: courseId,
      finished: false,
      owner: false,
    });
  
  if(userCourseError){
    return userCourseError.message
  }

  return true
});
