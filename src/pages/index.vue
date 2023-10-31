<template>
  <v-carousel cycle height="490" hide-delimiters show-arrows="hover">
    <v-carousel-item src="/img/poster_1.png" contain> </v-carousel-item>
    <v-carousel-item src="/img/poster_2.png" contain> </v-carousel-item>
    <v-carousel-item src="/img/poster_3.png" contain> </v-carousel-item>
  </v-carousel>
  <v-container class="my-8">
    <v-row>
      <v-col class="d-flex flex-column align-center">
        <v-icon icon="mdi-lightning-bolt" size="200px" color="yellow"></v-icon>
        <p class="centered-text">
          Potencia tu conocimiento y tiempo teniendo todos tus cursos en un solo
          lugar
        </p>
      </v-col>
      <v-col class="d-flex flex-column align-center">
        <v-icon icon="mdi-brain" size="200px" color="red"></v-icon>
        <p class="centered-text">
          Explora una nueva forma de aprender y repasar tus temas de interés
        </p>
      </v-col>
      <v-col class="d-flex flex-column align-center">
        <v-icon icon="mdi-book" size="200px" color="green"></v-icon>
        <p class="centered-text">
          Crea cursos interactivos y didácticos para tus estudiantes
        </p>
      </v-col>
    </v-row>
  </v-container>
  <v-container>
    <v-row>
      <v-col>
        <h1>Explora nuestros cursos</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <p>Echa un vistazo a los cursos que ofrecemos</p>
      </v-col>
    </v-row>
    <v-row>
      <span class="courses-organizer">
        <v-card
          max-width="400"
          v-for="course in courses"
          :key="course.id"
          class="course-card"
          @click="() => router.push(`courses/${course.id}`)"
        >
          <v-img :src="course.cover" height="200px" cover></v-img>
          <v-card-title>
            {{ course.title }}
          </v-card-title>
          <v-card-subtitle>
            {{ course.author }}
          </v-card-subtitle>
          <v-card-text>
            {{ course.description }}
          </v-card-text>
        </v-card>
      </span>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import mockCourses from "@/mock/courses.json";
import courseModel from "@/models/courseModel";
import CourseServices from "~/services/course-services";

// state variables
const coursesPagination = useState("homepage-courses_pagination", () => 0); // number of courses in screen
const courses = useState("homepage-courses", () => <any[]>[]); // array of courses

// Management variables
const router = useRouter();
const route = useRoute();
const services = new CourseServices();

// Redirect to signin verificated email --------------------------------------------
const parameters = route.hash.split("&");
let parametersObject: any = {};

for (const parameter of parameters) {
  const [key, value] = parameter.split("=");
  parametersObject[key] = decodeURIComponent(value);
}

if (
  parametersObject["#access_token"] &&
  parametersObject["expires_at"] &&
  parametersObject["type"] == "signup"
) {
  router.push("/auth/signin?message=true");
}
// -----------------------------------------------------------------------------------

// fetch courses data
/*
TODO: implement load courses
*/
async function loadCourses() {
  const coursesData = await services.getCourses(coursesPagination.value);

  if (typeof coursesData == "string") {
    return console.log(coursesData);
  }
  coursesPagination.value += 11;

  courses.value.push(...(coursesData as courseModel[]));
}

onMounted(async () => {
  courses.value = []
  await loadCourses();
});
</script>

<style>
.centered-text {
  text-align: center;
  width: 250px;
}

.courses-organizer {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}

.course-card {
  cursor: pointer;
}
</style>
