<template>
  <!-- Loading state -->
  <v-overlay v-model="overlay" class="d-flex justify-center align-center">
    <v-progress-circular
      color="indigo-lighten-2"
      :size="100"
      indeterminate
    ></v-progress-circular>
  </v-overlay>

  <!-- Verificated account -->
  <div>
    <v-alert
      type="success"
      title="Ya verificaste tu cuenta"
      text="Inicia sesión para continuar"
      closable
      v-model="alert"
    ></v-alert>
  </div>

  <!-- Sign in formulary -->
  <v-sheet class="bg-indigo-lighten-3 pa-12" height="100%" rounded>
    <v-card class="mx-auto my-auto px-6 py-8" max-width="400">
      <v-form @submit="(e) => e.preventDefault()">
        <span class="d-flex flex-column align-center mb-7">
          <h1>Entrar</h1>
          <small>¡es gratis también!</small>
        </span>
        <v-alert
          v-model="dialog"
          width="auto"
          type="error"
          :text="error"
          title="Error"
          class="mb-5"
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
          v-model="password"
          @click:append-inner="visible = !visible"
        ></v-text-field>
        <v-checkbox v-model="persistSession" label="Mantener sesión iniciada">
        </v-checkbox>
        <NuxtLink to="/auth/forgot-password"
          ><small>¿Olvidaste tu contraseña?</small></NuxtLink
        >

        <br />

        <v-btn
          block
          color="success"
          size="large"
          type="submit"
          variant="elevated"
          @click="sendData"
        >
          Entrar ahora
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
import useUserStore from "~/contexts/userStore";
import UserServices from "@/services/user-services";

// state variables
const dialog = useState("signin-error", () => false); // sign in error dialog visible
const visible = useState("signin-pwd", () => false); // password characters visible
const error = useState("signin-message", () => ""); // password error message
const alert = useState("signin-alert", () => false); // validated account message
const overlay = useState("signin-load_overlay", () => false); // loading state
const persistSession = useState("signin-persist_session", () => false); // persist session

// sign in data
const email = useState("signin-email", () => "");
const password = useState("signin-password", () => "");

// management variables
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const services = new UserServices();

async function sendData() {
  dialog.value = false;
  overlay.value = true;

  const data = await services.signin(
    email.value,
    password.value,
    persistSession.value
  );

  if (data) {
    overlay.value = false;
  }

  if (typeof data == "string") {
    email.value = "";
    password.value = "";
    error.value =
      data == "Invalid login credentials"
        ? "Algo está mal con tu correo o contraseña, intenta de nuevo"
        : data;
    dialog.value = true;
    return;
  }

  if (data.user.id) {
    // Restart state variables
    email.value = "";
    password.value = "";
    error.value = "";
    dialog.value = false;
    persistSession.value = false;

    // Insert user data

    userStore.isUserloged = true;
    userStore.userData = data.user;
    if (data.jwt) {
      localStorage.setItem("jwt", data.jwt);
    }
    router.push("/");
  }
}

// Reset all data
onBeforeMount(() => {
  email.value = "";
  password.value = "";
  persistSession.value = false;
  error.value = "";
  dialog.value = false;
  overlay.value = false;
});

alert.value = route.query.message == "true" ? true : false;
</script>
