import supabaseClient from "~~/server/supabaseClient";

export default eventHandler(async (event) => {
  const { password, access_token, refresh_token } = await readBody(event);

  await supabaseClient.auth.setSession({
    access_token: access_token,
    refresh_token: refresh_token,
  });

  const data = await supabaseClient.auth.updateUser({ password: password });

  if (data.error) {
    return data.error;
  }

  return data.data;
});
