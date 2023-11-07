import supabaseClient from "~~/server/supabaseClient";

export default eventHandler(async (event) => {
  const { itemId } = await readBody(event);

  const { data: itemData, error: itemError } = await supabaseClient.from('items').select().eq('id', itemId as string);

  if (itemError) {
    return itemError.message;
  }

  const { data: itemDeleteData, error: itemDeleteError } = await supabaseClient.from('items').delete().eq('id', itemId as string);

  if (itemDeleteError) {
    return itemDeleteError.message
  }

  const url = itemData[0].contentUrl
  const courseId = itemData[0].id_course

  const { data: ItemsDeleteData, error: ItemsDeleteError } = await supabaseClient.storage.from('items-files').remove([url as string]);

  if (ItemsDeleteError) {
    return ItemsDeleteError.message;
  }

  const courses = await fetch(`/api/courses/with-id?courseId=${courseId}`, { method: 'get' })

  const courseData = await courses.json()

  return courseData;
})