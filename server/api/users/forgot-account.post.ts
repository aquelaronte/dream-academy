import supabaseClient from "~~/server/supabaseClient";

export default eventHandler(async (event) => {
  const { email } = await readBody(event);

  const userData = await supabaseClient.from("users").select("*").eq("email", email);

  if(userData.error){
    return userData.error
  }

  if(userData.data.length < 1){
    return "Non existent User"
  }

  let url: any = event.headers.get("Referer")?.split("/").slice(0, -1);
  url?.push("reset-password");
  url = url?.join("/") + "/";

  const data = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: url,
  });

  if (data.error) {
    return data.error;
  }

  return data.data;
});
