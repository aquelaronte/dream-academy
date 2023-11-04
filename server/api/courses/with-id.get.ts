import supabaseClient from "~~/server/supabaseClient";

export default eventHandler(async (event) => {
  const { courseId } = getQuery(event);

  const { data: courseData, error: courseError } = await supabaseClient
    .from("courses")
    .select("*")
    .eq("id", courseId);

  if (courseError) {
    return courseError.message ;
  }

  

  const { data: authorData, error: authorError } = await supabaseClient
    .from("users")
    .select("name")
    .eq("id", courseData[0].id_author);

  const course = courseData[0];

  const coverUrl = supabaseClient.storage
    .from("courses-covers")
    .getPublicUrl(course.coverUrl);
  
  let authorName = ""

  if(authorData && authorData.length > 0){
    authorName = authorData[0].name
  }

  const items = await getCourseItems(course.id)

  const response = {
    ...course,
    cover: coverUrl.data.publicUrl,
    toLearn: JSON.parse(course.toLearn),
    author: authorName,
    items: items
  };

  return response;
});

async function getCourseItems(courseId : string){
  const { data: itemsData, error: itemsError } = await supabaseClient.from('items').select().eq('id_course', courseId);

  if(itemsError){
    return itemsError.message;
  }

  if(itemsData.length > 0){
    return itemsData
  } else {
    return "Este curso está vacío"
  }
}
