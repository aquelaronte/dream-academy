<template>
  <v-overlay v-model="overlay" class="d-flex justify-center align-center">
    <v-progress-circular
      color="indigo-lighten-2"
      :size="100"
      indeterminate
    ></v-progress-circular>
  </v-overlay>

  <v-container>
    <v-row>
      <v-col>
        <p>Selecciona un curso</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <span class="courses-organizer">
          <v-btn
            @click="
              () => {
                dialogState = true;
                activeCourse = course.id!
              }
            "
            v-for="course in ownCourses"
          >
            <v-card max-width="400" :key="course.id" class="course-card">
              <v-img :src="course.coverUrl" height="200px" cover></v-img>
              <v-card-title>
                {{ course.title }}
              </v-card-title>
              <v-card-subtitle>
                {{ userStore.userData.name }}
              </v-card-subtitle>
              <v-card-text>
                {{ course.description }}
              </v-card-text>
            </v-card>
          </v-btn>
        </span>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog
    v-model="dialogState"
    fullscren
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar dark>
        <v-btn icon dark @click="dialogState = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Sube tu archivo</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn variant="text" @click="saveItem()"> Guardar </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-row>
          <v-col>
            <v-text-field
              variant="outlined"
              label="Nombre"
              v-model="name"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea
              variant="outlined"
              label="Descripcion"
              v-model="description"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select
              label="Selecciona un tipo de material"
              :items="['PDF']"
              variant="outlined"
              v-model="fileType"
            ></v-select>
          </v-col>
        </v-row>
        <v-row v-if="fileType == 'PDF'" class="mb-4">
          <v-btn color="red-accent-1" class="w-100 h-100">
            <input
              type="file"
              accept=".pdf"
              class="file-picker"
              ref="pdfInput"
              @change="handlePdfChange()"
            />
            <v-container>
              <v-row>
                <v-col>
                  <v-icon icon="mdi-plus" style="font-size: 50px"></v-icon>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <p>Agrega tu pdf</p>
                </v-col>
              </v-row>
            </v-container>
          </v-btn>
        </v-row>
        <v-row v-if="loadedFile">
          <v-col cols="6" class="mx-auto">
            <v-alert color="transparent" class="text-center">
              <p>
                Se ha cargado exitosamente el archivo: {{ loadedFile.name }}
              </p>
            </v-alert>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import useUserStore from "~/contexts/userStore";
import CourseModel from "~/models/courseModel";
import UserServices from "~/services/user-services";
import CourseServices from "~/services/course-services";

/* State variables */
const dialogState = useState("add_item-dialogState", () => false);
const overlay = useState("add_item-overlay", () => false);
const ownCourses = useState("account-own_courses", () => <CourseModel[]>[]);
const activeCourse = useState("add_item-active_course", () => "");

/* Data variables */
const loadedFile = useState("add_item-file", () => <File>{});
const name = useState("add_item-name", () => "");
const description = useState("add_item-description", () => "");

const fileType = useState("add_item-file_type", () => "");
const userStore = useUserStore();
const services = new UserServices();
const courseServices = new CourseServices();
const pdfInput: Ref<HTMLInputElement | undefined> = ref();
const router = useRouter()

watch(
  () => userStore.userData.id,
  async (newValue, oldValue) => {
    if (newValue !== "") {
      const data = await services.getCreatedCourses(userStore.userData.id!);
      ownCourses.value = data;
    }
  }
);

function handlePdfChange() {
  const file = pdfInput.value!.files![0];

  loadedFile.value = file
}

async function saveItem() {
  overlay.value = true;
  console.log(activeCourse.value);
  
  const data = await courseServices.saveItem(
    activeCourse.value,
    loadedFile.value,
    name.value,
    description.value
  );

  if(data){
    console.log(data);
    overlay.value = false
    dialogState.value = false
    // router.push('/')
  }
}

onMounted(async () => {
  if (userStore.userData.id !== "") {
    const data = await services.getCreatedCourses(userStore.userData.id!);
    ownCourses.value = data;
  }
  loadedFile.value = <any>{}
  name.value = ""
  description.value = ""
  fileType.value = "";
  activeCourse.value = ""
  overlay.value = false
});
</script>

<style scoped>
.file-picker {
  height: 100%;
  width: 100%;
  opacity: 0;
  z-index: 999;
  position: absolute;
}
</style>
