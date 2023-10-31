import supabaseClient from "~~/server/supabaseClient";

function validateData(
  email: string,
  password: string,
  name: string,
  role: "Estudiante" | "Profesor"
) {
  // se valida el tipo de dato
  if (typeof email != "string") {
    return "email isn't a string";
  } else if (typeof password != "string") {
    return "password isn't a string";
  } else if (typeof name != "string") {
    return "name isn't a string";
  } else if (typeof role != "string") {
    return "role isn't a string";
  }

  // se valida que el string no esté vacío
  email = email.trim();
  if (email.length < 1) {
    return "email must have at least one character";
  } else if (password.length < 1) {
    return "password must have at least one character";
  } else if (name.trim().length < 1) {
    return "name must have at least one character";
  } else if (role.trim().length < 1) {
    return "role must have at least one character";
  }

  if (role != "Estudiante" && role != "Profesor") {
    return "role value isn't valid";
  }

  if (password.trim().length < 6 && password.trim().length > 20) {
    return "password length is invalid";
  }
  email = email.toLowerCase();
}

export default eventHandler(async (event) => {
  let { email, password, name, role } = await readBody(event);

  const error = validateData(email, password, name, role);

  if (error) {
    return error;
  }

  // Verificar que el usuario ya tenga cuenta creada ---------------------------------------------------
  const isUserRegistered =
    (
      await supabaseClient
        .from("users")
        .select("email")
        .eq("email", email)
        .limit(1)
    ).data?.length == 1
      ? true
      : false;
  if (isUserRegistered) {
    return "user is already registered";
  }
  // ---------------------------------------------------------------------------------------------------

  const authData = await supabaseClient.auth.signUp({ email, password });

  if (authData.error) {
    return authData.error;
  }

  name = name
    .split(" ")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const userData = await supabaseClient
    .from("users")
    .insert({ id_auth: authData.data.user?.id, name, role, email });

  if (userData.error) {
    supabaseClient.auth.admin.deleteUser(`${authData.data.user?.id}`);
    return userData.error;
  }
  return true;
});
