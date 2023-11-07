<template>
  <v-img :src="courseData.cover" cover height="300px"></v-img>
  <v-container style="margin-bottom: 200px;">
    <!-- Course info section -->
    <v-row>
      <v-col>
        <h1>{{ courseData.title }}</h1>
        <p class="text-subtitle-1" v-if="courseData.id_author">Por {{ courseData.author }}</p>
        <p class="text-subtitle-1" v-if="courseData.id && !courseData.id_author">Por <span style="color: tomato;">usuario
            borrado</span></p>
        <p class="font-italic text-body-2">Creado en {{ courseData.date }}</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="7">
        <p class="mt-4 w-4 text-body-1">{{ courseData.description }}</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <span v-if="!userStore.isUserloged">
          <NuxtLink to="/auth/signin">
            <v-btn variant="flat" color="red-lighten-4">Inicia sesión para continuar</v-btn>
          </NuxtLink>
        </span>
        <span v-if="userStore.isUserloged">
          <span v-if="!userCourseData.owner">
            <v-btn v-if="userCourseData.suscribed" @click="handleUnsubscribe()">Abandonar curso</v-btn>
            <v-btn v-if="!userCourseData.suscribed" @click="handleSubscribe()" color="indigo-lighten-2">Unirse
              ahora</v-btn>
          </span>
          <span v-if="userCourseData.owner">
            <v-btn color="green-lighten-2">Eres el creador del curso</v-btn>
          </span>
        </span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3>Beneficios</h3>
        <v-list>
          <v-list-item v-for="learn in courseData.toLearn">
            - {{ learn }}
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <!-- end of course info section -->


    <!-- Course's class -->
    <v-row>
      <v-col>
        <h3>Clases</h3>
        <span v-if="typeof courseData.items == 'string'">{{ courseData.items }}</span>
        <span v-if="!(typeof courseData.items == 'string')">
          <span>
            <v-expansion-panels>
              <v-expansion-panel v-for="item of courseData.items" :title="item.name" :text="item.description">
                <v-container>
                  <v-row>
                    <v-col>
                      <v-card>
                        <v-card-text>
                          <a :href="item.contentUrl" v-if="item.contentType != null && userCourseData.suscribed">
                            <v-btn v-if="item.contentType == 'application/pdf'"
                            >Abrir PDF adjunto</v-btn>
                          </a>
                          <v-btn disabled v-if="!userCourseData.suscribed">Debes unirte a este curso para seguir viendo</v-btn>
                          <v-btn v-if="courseData.id_author == userStore.userData.id" class="ml-2" color="red-lighten-3" @click="handleDeleteItem(item.id)">Borrar item</v-btn>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
              </v-expansion-panel>
            </v-expansion-panels>
          </span>
        </span>
      </v-col>
    </v-row>

    <!-- Add item -->
    <v-row v-if="courseData.id_author == userStore.userData.id">
      <v-col>
        <v-btn color="green-accent-1" class="w-100 h-100" @click="() => dialogState = true">
          <v-container>
            <v-row>
              <v-col>
                <v-icon icon="mdi-plus" style="font-size: 50px;"></v-icon>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <p>Añade un item</p>
              </v-col>
            </v-row>
          </v-container>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>

  <!-- Add item dialog -->
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
import CourseServices from "~/services/course-services";
import UserServices from "~/services/user-services";

// Management variables
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const services = new CourseServices();
const userServices = new UserServices();
const { id: courseId } = route.params;
const pdfInput: Ref<HTMLInputElement | undefined> = ref();

// State variables
const courseData = useState("courses-course_data", () => <any>{});
const userCourseData = useState("courses-user_courses_data", () => <any>{});
const overlay = useState("courses_add_item-overlay", () => false);
const dialogState = useState("courses_add_item-dialogState", () => false);

// Data variables
const loadedFile = useState("courses_add-item-file", () => <File>{});
const name = useState("courses_add-item-name", () => "");
const description = useState("courses_add-item-description", () => "");
const fileType = useState("add_item-file_type", () => "");

function handlePdfChange() {
  const file = pdfInput.value!.files![0];

  loadedFile.value = file
}

async function saveItem() {
  overlay.value = true;
  
  const data = await services.saveItem(
    courseId as string,
    loadedFile.value,
    name.value,
    description.value
  );

  if(data){
    console.log(data);
    overlay.value = false
    dialogState.value = false
    router.push('/')
  }
}

watch(
  () => userStore.userData.id,
  async (newValue, oldValue) => {
    if (newValue !== "") {
      userCourseData.value = await services.getUserCourse(
        courseId as string,
        newValue!
      );
    }
  }
);

async function handleDeleteItem(itemId: string) {
  await services.deleteItem(itemId);

  router.push('/')
}

async function handleSubscribe() {
  const data = await userServices.subscribeToCourse(
    userStore.userData.id! as string,
    courseId! as string
  );

  console.log(data);

  if (typeof data == "string") {
    return console.log(data);
  }

  if (typeof data == "boolean" && data) {
    window.location.reload();
  }
}

async function handleUnsubscribe() {
  const data = await userServices.unsubscribeToCourse(
    userStore.userData.id! as string,
    courseId! as string
  );

  console.log(data);

  if (typeof data == "string") {
    return console.log(data);
  }

  if (typeof data == "boolean" && data) {
    window.location.reload();
  }
}

onBeforeUnmount(() => {
  userCourseData.value = {}
  courseData.value = {}
})

onBeforeMount(async () => {
  userCourseData.value = {};
  courseData.value = {};
  if (userStore.userData.id !== "") {
    userCourseData.value = await services.getUserCourse(
      courseId as string,
      userStore.userData.id!
    );
  }
  const data = await services.getCourseById(courseId as string);
  courseData.value = data;

  console.log(data);

});
</script>
