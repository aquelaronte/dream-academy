import supabaseClient from "~~/server/supabaseClient";

export default eventHandler(async (event) => {
  const { jwt } = await readBody(event);

  const userAuth = await supabaseClient.auth.getUser(jwt);

  if (userAuth.error) {
    return userAuth.error;
  }

  const auth_id = userAuth.data.user.id;

  const userData = await supabaseClient
    .from("users")
    .select("*")
    .eq("id_auth", auth_id);

  if (userData.error) {
    return userData.error;
  }

  const user = userData.data[0];
  const auth = userAuth.data.user

  return {
    id: user.id,
    id_auth: auth.id,
    name: user.name,
    role: user.role,
    email: user.email
  }
});
