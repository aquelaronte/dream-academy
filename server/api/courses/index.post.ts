import { v4 } from "uuid";
import supabaseClient from "~~/server/supabaseClient";

export default eventHandler(async (event) => {
  const formData = await readFormData(event);

  const title = formData.get("title");
  const description = formData.get("description");
  const date = formData.get("date");
  const id_author = formData.get("id_author");
  const toLearn = formData.get("toLearn");
  const coverFile = formData.get("coverFile");

  const data = await supabaseClient.storage
    .from("courses-covers")
    .upload(`cover-${v4()}`, coverFile!);

  if(data.error){
    return data.error;
  }

  const { data: courseData, error: courseError } = await supabaseClient
    .from("courses")
    .insert({
      title,
      description,
      date,
      id_author,
      toLearn,
      coverUrl: data.data?.path,
    })
    .select("*");

  if (courseError) {
    return courseError.message;
  }

  const { data: userCourseData, error: userCourseError } = await supabaseClient
    .from("users_courses")
    .insert({
      id_user: id_author,
      id_course: courseData[0].id,
      finished: true,
      owner: true,
    });

  if (userCourseError) {
    return userCourseError.message;
  }

  return true;
});
