import UserModel from "~/models/userModel";
import supabaseClient from "~~/server/supabaseClient";

export default eventHandler(async (event) => {
  const { email, password, persistSession } = await readBody(event);

  const authData = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (authData.error) {
    return authData.error.message;
  }

  let userData = await supabaseClient
    .schema("public")
    .from("users")
    .select("*")
    .eq("id_auth", authData.data.user.id);

  if (userData.error) {
    return userData.error.message;
  }

  const user: UserModel = userData.data[0];

  let jwt: any = authData.data.session.access_token;

  if (!persistSession) {
    jwt = null;
  }

  return {
    user: {
      id: user.id,
      id_auth: user.id_auth,
      name: user.name,
      role: user.role,
      email: user.email,
    },
    jwt: jwt,
  };
});
