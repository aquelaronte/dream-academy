<template>
  <!-- Loading state -->
  <v-overlay v-model="overlay" class="d-flex justify-center align-center">
    <v-progress-circular
      color="indigo-lighten-2"
      :size="100"
      indeterminate
    ></v-progress-circular>
  </v-overlay>

  <!-- Main card -->
  <v-card>
    <div class="d-flex flex-row">
      <!-- Vertical tabs -->
      <v-tabs v-model="tab" direction="vertical" color="indigo-accent-3">
        <v-tab value="profile">
          <v-icon start> mdi-account </v-icon>
          Perfil
        </v-tab>
        <v-tab value="security">
          <v-icon start> mdi-lock </v-icon>
          Seguridad
        </v-tab>
        <v-tab value="option-3">
          <v-icon start> mdi-access-point </v-icon>
          Option 3
        </v-tab>
      </v-tabs>
      <!-- Tabs views -->
      <v-window v-model="tab">
        <!-- 
          TODO: implement profile photo update formulary after implement profile photo, this work is third priority
        -->
        <!-- View #1 perfil -->
        <v-window-item value="profile">
          <v-card flat>
            <v-form>
              <v-card-text>
                <v-container>
                  <!-- Title -->
                  <v-row>
                    <h2>Datos de perfil del usuario:</h2>
                  </v-row>
                  <v-row class="my-4">
                    <!-- Description -->
                    <p>
                      Los datos de perfil son datos visibles para todo el
                      público y proporciona hacia los demás una imagen sobre
                      quien eres tu
                    </p>
                  </v-row>
                  <v-row>
                    <!-- Update user data formulary -->
                    <v-col>
                      <v-text-field
                        prepend-inner-icon="mdi-account"
                        label="Nombre completo"
                        variant="outlined"
                        :disabled="!isProfileEditing"
                        v-model="name"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-select
                        prepend-inner-icon="mdi-account-group"
                        label="¿Cuál deseas ser?"
                        variant="outlined"
                        :items="['Estudiante', 'Profesor']"
                        :disabled="!isProfileEditing"
                        v-model="role"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="indigo-accent-2"
                  variant="flat"
                  @click="() => (isProfileEditing = !isProfileEditing)"
                  :disabled="isProfileEditing"
                  >Editar</v-btn
                >
                <v-btn
                  color="grey-darken-3"
                  variant="flat"
                  @click="
                    () => {
                      isProfileEditing = !isProfileEditing;
                      name = userStore.userData.name;
                      role = userStore.userData.role;
                    }
                  "
                  :disabled="!isProfileEditing"
                  >Cancelar</v-btn
                >
                <v-spacer></v-spacer>
                <v-btn
                  color="indigo-accent-2"
                  variant="flat"
                  @click="updateProfile()"
                >
                  Guardar
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
          <!-- Some text for increase the component width -->
          <p style="color: transparent">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
            incidunt nam eveniet iusto, laborum laboriosam sint inventore
            quisquam. Magnam iusto quas nulla aperiam, cum quasi officiis.
            Accusamus rem sed sit.
          </p>
        </v-window-item>

        <!-- 
          TODO: implement send data functions after create api endpoint, this work is first priority

          FIXME: decorate some more the formulary, this work is second priority
         -->
        <!-- View #2 seguridad -->
        <v-window-item value="security">
          <v-card flat>
            <v-form @submit="(e) => e.preventDefault()">
              <v-card-text>
                <v-container>
                  <v-row>
                    <!-- Title -->
                    <h2>Datos de seguridad del usuario:</h2>
                  </v-row>
                  <v-row class="my-4">
                    <!-- Description -->
                    <p>
                      Los datos de seguridad son datos no visibles para todo el
                      público y son los que usas para acceder a tu cuenta
                    </p>
                  </v-row>
                  <v-row>
                    <v-btn color="indigo-accent-2"
                      >Cambiar correo electrónico</v-btn
                    >
                  </v-row>
                  <v-row>
                    <v-btn class="mt-2" color="indigo-accent-2"
                      >Cambiar contraseña</v-btn
                    >
                  </v-row>
                </v-container>
              </v-card-text>
            </v-form>
          </v-card>
          <!-- Some text for increase the component width -->
          <p style="color: transparent">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
            incidunt nam eveniet iusto, laborum laboriosam sint inventore
            quisquam. Magnam iusto quas nulla aperiam, cum quasi officiis.
            Accusamus rem sed sit.
          </p>
        </v-window-item>

        <!-- 
          TODO: implement notifications configuration after implement notifications in app, this configuration have third priority
         -->
        <!-- View #3 notifications (later) -->
        <v-window-item value="option-3">
          <v-card flat>
            <v-card-text>
              <p>
                Fusce a quam. Phasellus nec sem in justo pellentesque facilisis.
                Nam eget dui. Proin viverra, ligula sit amet ultrices semper,
                ligula arcu tristique sapien, a accumsan nisi mauris ac eros. In
                dui magna, posuere eget, vestibulum et, tempor auctor, justo.
              </p>

              <p class="mb-0">
                Cras sagittis. Phasellus nec sem in justo pellentesque
                facilisis. Proin sapien ipsum, porta a, auctor quis, euismod ut,
                mi. Donec quam felis, ultricies nec, pellentesque eu, pretium
                quis, sem. Nam at tortor in tellus interdum sagittis.
              </p>
            </v-card-text>
          </v-card>
        </v-window-item>
      </v-window>
    </div>
  </v-card>
</template>
<script setup lang="ts">
import useUserStore from "~/contexts/userStore";
import UserServices from "~/services/user-services";

// state vaiables
const tab = useState("user_settings-tab", () => "profile");
const overlay = useState("user_settings-overlay", () => false);

// management variables
const userStore = useUserStore();
const services = new UserServices();

// data variables
const name = useState("user_settings-name", () => userStore.userData.name);
const role = useState("user_settings-role", () => userStore.userData.role);

const isProfileEditing = useState(
  "user_settings-is_profile_editing",
  () => false
);

async function updateProfile() {
  overlay.value = true;

  const data = await services.updateProfile(
    parseInt(userStore.userData.id!, 10),
    name.value,
    role.value
  );

  if (data.message) {
    console.log(data);
    overlay.value = false;
    return;
  }

  if (data.data) {
    const user = data.data[0];
    window.location.reload();
  }
}

onBeforeMount(() => {
  overlay.value = false;
  tab.value = "profile";
});
</script>
