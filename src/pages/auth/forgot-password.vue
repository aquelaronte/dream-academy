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
        <h1 class="text-center">¿Olvidaste tu contraseña?</h1>
        <small>Ingresa tu correo y sigue los pasos</small>
      </span>
      <v-text-field
        prepend-inner-icon="mdi-email"
        class="mb-2"
        clearable
        label="Correo electrónico"
        v-model="email"
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
      v-model="error_dialog"
      width="auto"
      type="error"
      text="El usuario no existe"
      title="Proceso exitoso"
      class="mt-8"
      closable
    ></v-alert>
    <v-alert
      v-model="success_dialog"
      width="auto"
      type="success"
      text="Ya te hemos enviado tu correo de recuperación ¡Sigue los pasos!"
      title="Proceso exitoso"
      class="mt-8"
      closable
    ></v-alert>
  </v-card>
</template>

<script setup lang="ts">
import UserServices from "~/services/user-services";

// state variables
const overlay = useState("forgotAccount-load_overlay", () => false); // loading state
const success_dialog = useState("forgotAccount-success_dialog", () => false); // success alert successfully delivered
const error_dialog = useState("forgotAccount-error_dialog", () => false); // error alert

// sign in data
const email = useState("forgotAccount-email", () => "");

// management variables
const services = new UserServices();

async function sendData() {
  error_dialog.value = false;
  success_dialog.value = false;
  overlay.value = true;

  const data = await services.forgotPassword(email.value);

  if (data) {
    overlay.value = false;
  }

  if (typeof data == "string") {
    error_dialog.value = true;
  } else {
    success_dialog.value = true;
  }
}

// Reset all data
onBeforeMount(() => {
  email.value = "";
  error_dialog.value = false;
  success_dialog.value = false;
  overlay.value = false;
});
</script>
