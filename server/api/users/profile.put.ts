import supabaseClient from "~~/server/supabaseClient";

export default eventHandler(async (event) => {
  const { name, role, id } = await readBody(event);

  const userData = await supabaseClient
    .from("users")
    .update({ name, role })
    .eq("id", id)
    .select();

  if (userData.error) {
    return userData.error;
  }

  return userData;
});