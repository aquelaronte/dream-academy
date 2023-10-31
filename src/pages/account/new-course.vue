<template>
  <v-dialog v-model="isEditing" scrollable>
    <template v-slot:default="{ isActive }">
      <v-card width="auto" height="auto">
        <span>
          <v-container>
            <v-row>
              <v-col>
                <cropper
                  ref="cropperCover"
                  :src="previewImageUrl"
                  :stencil-props="{
                    aspectRatio: 16 / 9,
                  }"
                  :maxWidth="1550"
                  :maxHeight="869"
                ></cropper>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <p>
                  La imagen debe no puede ser mas grande de 1550px de ancho y
                  869px de alto
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="auto">
                <v-btn
                  color="green-lighten-3"
                  class="mr-4"
                  @click="handleSaveCrop()"
                  >Guardar</v-btn
                >
              </v-col>
              <v-col cols="auto">
                <v-btn color="red-lighten-3" @click="handleCancelCrop()"
                  >Cancelar</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </span>
      </v-card>
    </template>
  </v-dialog>

  <span>
    <v-img
      cover
      height="300px"
      id="cover"
      ref="coverImage"
      :src="coverImageUrl"
    >
      <input
        type="file"
        id="image-picker"
        accept="image/*"
        ref="fileInput"
        @change="handleFileChange"
      />
    </v-img>
  </span>
  <v-container style="margin-bottom: 50px">
    <v-row>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col cols="auto">
        <input
          type="text"
          style="display: block; font-size: 2em; font-weight: bold"
          v-model="title"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <p class="text-subtitle-1">Por {{ userStore.userData.name }}</p>
        <p class="font-italic text-body-2">Creado en {{ date }}</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col> </v-col>
    </v-row>
    <v-row>
      <v-col cols="7">
        <v-textarea
          variant="solo"
          placeholder="Clic para editar descripción"
          auto-grow
          v-model="description"
        ></v-textarea>
        <input type="text" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn disabled> Curso en construcción </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="9">
        <h2>Beneficios</h2>
        <v-list>
          <v-list-item v-for="(item, index) in listItems" id="item">
            <v-container class="px-0 py-0 mx-0 my-0" :key="index">
              <v-row>
                <v-col cols="7">
                  <v-textarea
                    variant="solo"
                    placeholder="Clic para editar"
                    rows="2"
                    no-resize
                    :key="`textarea-${index}`"
                    v-model="listItems[index]"
                  >
                  </v-textarea>
                </v-col>
                <v-col cols="2">
                  <v-btn
                    icon="mdi-delete"
                    class="ml-2"
                    @click="listItems.splice(index, 1)"
                    :key="`button-${index}`"
                  ></v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-list-item>
        </v-list>
        <v-btn prepend-icon="mdi-plus" @click="listItems.push('')"
          >Agregar beneficio</v-btn
        >
      </v-col>
    </v-row>
    <v-row class="mt-8">
      <v-col cols="auto">
        <v-btn color="green-lighten-2" @click="sendData()"
          >Publicar curso</v-btn
        >
      </v-col>
      <v-col cols="auto">
        <v-btn color="red-lighten-3" @click="router.push('/')">Cancelar</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import useUserStore from "~/contexts/userStore";
import CourseServices from "~/services/course-services";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

// State variables
const previewImageUrl = useState("new_course-previewImage_url", () => "");
const coverImageUrl = useState("new_course-coverImage_Url", () => "");
const isEditing = useState("new_course-is_editing", () => false);

// Data variables
const title = useState("new_course-title", () => "Clic para editar título");
const description = useState("new_course-description", () => "");
const listItems = useState("new_course-item_list", () => <string[]>[]);
let coverFile: any | File;
let date = "";

// Management variables
const userStore = useUserStore();
const services = new CourseServices();
const router = useRouter();

// Refs
const fileInput: Ref<HTMLInputElement | undefined> = ref();
const cropperCover = ref();

function handleCancelCrop() {
  isEditing.value = false;
  previewImageUrl.value = "";
}

function handleSaveCrop() {
  const { coordinates, canvas } = cropperCover.value.getResult();

  var dataURL = canvas.toDataURL("image/jpeg", 0.8); // Puedes especificar el formato que necesitas

  // Convierte la Data URL a datos binarios
  var blobBin = atob(dataURL.split(",")[1]);

  // Crea un array de 8 bits sin signo
  var array = [];
  for (var i = 0; i < blobBin.length; i++) {
    array.push(blobBin.charCodeAt(i));
  }

  // Crea un objeto Blob con los datos binarios
  var fileBlob = new Blob([new Uint8Array(array)], { type: "image/jpeg" }); // Ajusta el tipo según el formato de la imagen

  // Crea un objeto File
  var file = new File([fileBlob], "canva.jpg", {
    type: "image/jpeg",
  });

  const reader = new FileReader();
  coverFile = file;

  reader.onload = (e) => {
    const imageDataUrl = e.target?.result;
    coverImageUrl.value = imageDataUrl as string;
  };

  reader.readAsDataURL(file);

  isEditing.value = false;
}

async function sendData() {
  if (coverFile instanceof File) {
    const data = await services.publishCourse(
      title.value,
      description.value,
      date,
      userStore.userData.id!,
      listItems.value,
      coverFile
    );

    if (typeof data.value == "string") {
      console.log(data);
      return;
    }

    if (typeof data.value == "boolean" && data.value) {
      title.value = "Clic para editar título";
      description.value = "Clic para editar descripción";
      listItems.value = [];
      previewImageUrl.value = "";
      router.push("/");
    }
  } else {
    console.log("Pick a cover image");
    return;
  }
}

function handleFileChange() {
  const file = fileInput.value!.files![0];
  isEditing.value = true;

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const imageDataUrl = e.target?.result;
      previewImageUrl.value = imageDataUrl as string;
    };

    reader.readAsDataURL(file);
  }

  fileInput.value!.files = null;
}

onMounted(() => {
  title.value = "Clic para editar título";
  description.value = "Clic para editar descripción";
  listItems.value = [];
  previewImageUrl.value = "";
  coverImageUrl.value = "";
});

onBeforeMount(() => {
  const currentDate = new Date();

  const monthNames = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  const month = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  // Crear la cadena de fecha formateada
  date = `${month} de ${year}`;
});
</script>

<style scoped>
#cover {
  background-color: rgb(184, 184, 184);
  display: flex;
}

#cover:hover {
  background-color: rgb(163, 163, 163);
}

#image-picker {
  height: 100%;
  width: 100%;
  opacity: 0;
  z-index: 999;
}
</style>
