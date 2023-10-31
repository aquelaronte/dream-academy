<template>
  <v-img :src="courseData.cover" cover height="300px"></v-img>
  <v-container>
    <v-row>
      <v-col> </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h1>{{ courseData.title }}</h1>
        <p class="text-subtitle-1">Por {{ courseData.author }}</p>
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
            <v-btn variant="flat" color="red-lighten-4"
              >Inicia sesión para continuar</v-btn
            >
          </NuxtLink>
        </span>
        <span v-if="userStore.isUserloged">
          <span v-if="!userCourseData.owner">
            <v-btn v-if="userCourseData.suscribed" @click="handleUnsubscribe()"
              >Abandonar curso</v-btn
            >
            <v-btn
              v-if="!userCourseData.suscribed"
              @click="handleSubscribe()"
              color="indigo-lighten-2"
              >Unirse ahora</v-btn
            >
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
  </v-container>
</template>

<script setup lang="ts">
import useUserStore from "~/contexts/userStore";
import CourseModel from "~/models/courseModel";
import CourseServices from "~/services/course-services";
import UserServices from "~/services/user-services";

// Management variables
const route = useRoute();
const userStore = useUserStore();
const courseData = useState("courses-course_data", () => <any>{});
const userCourseData = useState("courses-user_courses_data", () => <any>{});
const services = new CourseServices();
const userServices = new UserServices();
const { id: courseId } = route.params;

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
});
</script>
