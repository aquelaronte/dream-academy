<template>
  <!-- Loading state -->
  <v-overlay v-model="overlay" class="d-flex justify-center align-center">
    <v-progress-circular
      color="indigo-lighten-2"
      :size="100"
      indeterminate
    ></v-progress-circular>
  </v-overlay>

  <!-- Sign in formulary -->
  <v-card class="mx-auto my-auto px-6 py-8" width="500">
    <v-form @submit="(e) => e.preventDefault()">
      <span class="d-flex flex-column align-center mb-7">
        <h1 class="text-center">Ingresa tu nueva contraseña</h1>
      </span>
      <v-alert
        v-model="dialog"
        width="auto"
        type="error"
        :text="error"
        title="Error"
        closable
      ></v-alert>
      <v-text-field
        prepend-inner-icon="mdi-lock"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        label="Contraseña"
        clearable
        v-model="password"
        @click:append-inner="visible = !visible"
      ></v-text-field>

      <br />

      <v-btn
        block
        color="success"
        size="large"
        type="submit"
        variant="elevated"
        @click="sendData"
      >
        Enviar correo
      </v-btn>
    </v-form>
    <v-alert
      v-model="success_dialog"
      width="auto"
      type="success"
      text="Contraseña reestablecida con éxito, ahora prueba a iniciar sesión con tu nueva contraseña"
      title="Proceso exitoso"
      class="mt-8"
      closable
    ></v-alert>
  </v-card>
</template>

<script setup lang="ts">
import UserServices from "~/services/user-services";

// state variables
const dialog = useState("resetPassword-error", () => false); // forgot account error dialog visibl
const error = useState("resetPassword-message", () => ""); // forgot account error message
const overlay = useState("resetPassword-load_overlay", () => false); // loading state
const success_dialog = useState("resetPassword-success_dialog", () => false); // success alert successfully delivered
const visible = useState("resetPassword", () => false); // is password input visible

// sign in data
const password = useState("resetPassword-password", () => "");

// management variables
const route = useRoute();
const services = new UserServices();

const parameters = route.hash.split("&");
let parametersObject: any = {};

for (const parameter of parameters) {
  const [key, value] = parameter.split("=");
  parametersObject[key] = decodeURIComponent(value);
}

// TODO: FINISH SENDDATA FUNCTION AND API, CHANGE VISUAL S
async function sendData() {
  dialog.value = false;
  overlay.value = true;

  const access_token = parametersObject["#access_token"];
  const refresh_token = parametersObject["refresh_token"];

  const data = await services.resetPassword(
    password.value,
    access_token,
    refresh_token
  );

  if (data) {
    overlay.value = false;
  }

  if (typeof data == "string") {
    dialog.value = true;
    error.value = data;
  } else {
    success_dialog.value = true;
  }
}

// Reset all data
onBeforeMount(() => {
  visible.value = false;
  password.value = "";
});
</script>
