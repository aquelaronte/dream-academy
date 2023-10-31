<template>
  <Navbar />
  <!-- Loading state -->
  <v-overlay v-model="overlay" class="d-flex justify-center align-center">
    <v-progress-circular
      color="indigo-lighten-2"
      :size="100"
      indeterminate
    ></v-progress-circular>
  </v-overlay>

  <CoursesMenu v-if="userStore.userData.role == 'Profesor'"></CoursesMenu>
  <slot class="mt-4">
  </slot>
</template>

<script setup lang="ts">
import useUserStore from "~/contexts/userStore";
import axios from "axios";

let userDataChecked = false;
const userStore = useUserStore();
const router = useRouter();
const overlay = useState("root-overlay_state", () => false);

onBeforeMount(async () => {
  if (!userDataChecked) {
    const token = localStorage.getItem("jwt");

    if (!token) {
      return;
    }

    overlay.value = true;
    const verifiedToken = await axios.post("/api/auth/verify-token", {
      jwt: token,
    });

    if (!verifiedToken) {
      localStorage.removeItem("jwt");
      router.push("/");
    }

    if (verifiedToken) {
      const { data } = await axios.post("/api/users/get-user", { jwt: token });

      if (data) {
        overlay.value = false;
      }

      if (typeof data == "string") {
        localStorage.removeItem("jwt");
        router.push("/");
        return;
      }

      userStore.userData = data;
      userStore.isUserloged = true;
      const name_settings = useState(
        "user_settings-name",
        () => userStore.userData.name
      );
      const role_settings = useState(
        "user_settings-role",
        () => userStore.userData.role
      );

      name_settings.value = userStore.userData.name;
      role_settings.value = userStore.userData.role;
    }
    userDataChecked = true;
  }
});
</script>

<style></style>
