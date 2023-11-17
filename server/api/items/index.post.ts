import { v4 } from "uuid";
import supabaseClient from "~~/server/supabaseClient";

export default eventHandler(async (event) => {
  const formData = await readFormData(event);

  const course_id = formData.get("course_id");
  const file = <any>formData.get("file");
  const name = formData.get("name");
  const description = formData.get("description");

  const { data: fileData, error: fileError } = await supabaseClient.storage
    .from("items-files")
    .upload(`${v4()}-${file!.name}`, file);

  if (fileError) {
    return { fileError };
  }
  
  const { data: itemData, error: itemError } = await supabaseClient
    .from("items")
    .insert({
      name,
      description,
      id_course: course_id,
      contentUrl: fileData.path,
      contentType: file.type,
    });

  if (itemError) {
    return { itemError };
  }

  return true;
});
