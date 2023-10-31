<template>
  <v-layout>
    <v-app-bar :elevation="1" style="position: relative">
      <template v-slot:prepend>
        <NuxtLink to="/">
          <img src="~/assets/logo.png" alt="Dream Academy Logo" id="logo" />
        </NuxtLink>
      </template>
      <template v-slot:default>
        <v-card color="transparent" width="600">
          <v-card-text>
            <v-text-field
              density="compact"
              variant="solo"
              label="Busca algún curso"
              append-inner-icon="mdi-magnify"
              single-line
              hide-details
            ></v-text-field>
          </v-card-text>
        </v-card>
      </template>
      <template v-slot:append>
        <!-- User is loged -->
        <span v-if="userStore.isUserloged">
          <v-menu open-on-hover width="350">
            <template v-slot:activator="{ props }">
              <v-btn variant="flat" color="indigo-accent-1" v-bind="props">
                <p class="mr-2">menu</p>
                <v-icon icon="mdi-menu"></v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-container>
                  <v-row class="d-flex justify-center">
                    <v-avatar icon="mdi-account"></v-avatar>
                  </v-row>
                  <v-row class="d-flex justify-center">
                    <small>
                      {{ userStore.userData.name }}
                    </small>
                  </v-row>
                  <v-row class="d-flex justify-center">
                    <small>
                      {{ userStore.userData.email }}
                    </small>
                  </v-row>
                </v-container>
              </v-list-item>
              <v-divider class="border-opacity-50"></v-divider>
              <v-list-item class="clickable">
                <NuxtLink
                  to="/account"
                  style="color: black; text-decoration: none"
                >
                  <p>Ver perfil</p>
                </NuxtLink>
              </v-list-item>
              <v-list-item class="clickable">
                <NuxtLink
                  to="/account/settings"
                  style="color: black; text-decoration: none"
                >
                  <p>Ajustes</p>
                </NuxtLink>
              </v-list-item>
              <v-divider class="border-opacity-50"></v-divider>
              <v-list-item class="clickable">
                <p @click="closeSession()">Cerrar sesión</p>
              </v-list-item>
            </v-list>
          </v-menu>
        </span>

        <!-- User isn't loged -->
        <span v-if="!userStore.isUserloged">
          <NuxtLink to="/auth/signin">
            <v-btn color="indigo-darken-2" variant="outlined"
              >Inicia sesión</v-btn
            >
          </NuxtLink>

          <NuxtLink to="/auth/signup">
            <v-btn color="indigo-darken-2" variant="flat" class="ml-2"
              >Regístrate</v-btn
            >
          </NuxtLink>
        </span>
      </template>
    </v-app-bar>
  </v-layout>
</template>

<script setup lang="ts">
import useUserStore from "~/contexts/userStore";

const userStore = useUserStore();
const router = useRouter();

function closeSession() {
  userStore.userData = {
    id: "",
    id_auth: "",
    name: "",
    role: "",
    email: "",
  };
  localStorage.removeItem("jwt");
  userStore.isUserloged = false;
  router.push("/");
}
</script>

<style scoped>
#logo {
  height: 50px;
}

.clickable {
  cursor: pointer;
}
</style>
