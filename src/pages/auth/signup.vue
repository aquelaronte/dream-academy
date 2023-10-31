<template>
  <!-- Loading state -->
  <v-overlay v-model="overlay" class="d-flex justify-center align-center">
    <v-progress-circular
      color="indigo-lighten-2"
      :size="100"
      indeterminate
    ></v-progress-circular>
  </v-overlay>

  <!-- Email sended dialog -->
  <v-dialog width="800" v-model="emailSended">
    <template v-slot:default>
      <v-card>
        <v-card-text class="d-flex flex-column align-center justify-center">
          <div class="text-h3 pt-12 pt-1">Te hemos enviado un correo</div>
          <div class="text-h6">Revisa tu email para verificar tu cuenta</div>
          <div class="pa-12 d-flex flex-column align-center">
            <div>
              <v-icon icon="mdi-email-newsletter" size="110"></v-icon>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>

  <!-- Sign up formulary -->
  <v-sheet class="bg-indigo-lighten-3 pa-12" height="100%" rounded>
    <v-card class="mx-auto my-auto px-6 py-8" max-width="400">
      <v-form @submit="(e) => e.preventDefault()">
        <span class="d-flex flex-column align-center mb-7">
          <h1>Regístrate</h1>
          <small>es gratis</small>
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
          prepend-inner-icon="mdi-email"
          class="mb-2"
          clearable
          label="Correo electrónico"
          v-model="email"
        ></v-text-field>

        <v-text-field
          prepend-inner-icon="mdi-lock"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          label="Contraseña"
          clearable
          hint="Debe contener mínimo 6 carácteres y máximo 20"
          @click:append-inner="visible = !visible"
          v-model="password"
        ></v-text-field>

        <v-text-field
          clearable
          prepend-inner-icon="mdi-account"
          label="Nombre completo"
          hint="Puedes dejarlo en minúsculas, lo arreglaremos para ti"
          v-model="name"
        ></v-text-field>

        <v-select
          prepend-inner-icon="mdi-account-group"
          label="¿Cuál deseas ser?"
          :items="['Estudiante', 'Profesor']"
          v-model="role"
        ></v-select>

        <v-checkbox v-model="terms" color="indigo-accent-1">
          <template v-slot:label>
            <div>
              Acepto los
              <v-tooltip location="bottom">
                <template v-slot:activator="{ props }">
                  <a
                    target="_blank"
                    href="https://vuetifyjs.com"
                    v-bind="props"
                    @click.stop
                  >
                    términos y condiciones
                  </a>
                </template>
                Haz clic para leer los términos y condiciones
              </v-tooltip>
            </div>
          </template>
        </v-checkbox>

        <br />

        <v-btn
          block
          color="success"
          size="large"
          type="submit"
          variant="elevated"
          @click="sendData()"
          :disabled="!terms"
        >
          Crear cuenta
        </v-btn>

        <v-divider class="border-opacity-100" color="success"></v-divider>

        <v-row>
          <v-col class="d-flex justify-center my-7">
            <p class="text-body-2">Accede también con alguna de tus cuentas</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex justify-center">
            <v-btn icon="mdi-google" variant="outlined"></v-btn>
          </v-col>
          <v-col class="d-flex justify-center">
            <v-btn icon="mdi-facebook" variant="outlined"></v-btn>
          </v-col>
          <v-col class="d-flex justify-center">
            <v-btn icon="mdi-microsoft" variant="outlined"></v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-sheet>
</template>

<script setup lang="ts">
import UserServices from "~/services/user-services";

// state variables
const overlay = useState("signup-load_overlay", () => false); // loading state
const dialog = useState("signup-error", () => false); // error dialog
const error = useState("signup-message", () => ""); // error message
const visible = useState("signup-pwd", () => false); // is password visible
const emailSended = useState("signup-email_sended", () => false); // confirmation email dialog

// sign up data
const name = useState("signup-name", () => "");
const email = useState("signup-email", () => "");
const password = useState("signup-password", () => "");
const role = useState("signup-role", () => "");
const terms = useState("signup-terms", () => false);

// management variables
const services = new UserServices();

async function sendData() {
  overlay.value = true;
  const data = await services.signup(
    name.value,
    email.value,
    password.value,
    role.value
  );

  if (data) {
    overlay.value = false;
  }

  if (typeof data == "string") {
    email.value = "";
    password.value = "";
    error.value =
      data == "Invalid login credentials"
        ? "Algo ocurrió mal, intenta de nuevo"
        : data;
    dialog.value = true;

    return;
  }

  if (typeof data == "boolean" && data) {
    name.value = "";
    email.value = "";
    password.value = "";
    role.value = "";
    emailSended.value = true;
  }
}

// reset all data
onBeforeMount(() => {
  name.value = "";
  email.value = "";
  password.value = "";
  role.value = "";
  dialog.value = false;
  error.value = "";
  overlay.value = false;
  emailSended.value = false;
  terms.value = false;
});
</script>
