<template>
  <v-sheet style="width: 100vw; height: 200px" class="bg-grey-darken-1">
    <v-container>
      <v-row style="margin-top: 110px">
        <v-col cols="auto">
          <v-avatar
            :image="userStore.userData.profile_photo"
            size="80"
            style="border: 3px solid black"
            class="bg-white"
          ></v-avatar>
        </v-col>
        <v-col cols="auto">
          <h2>
            {{ userStore.userData.name }}
          </h2>
          <h5>
            {{ userStore.userData.role }}
          </h5>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
  <v-container class="mt-8">
    <v-row>
      <v-col>
        <h2>Mis cursos</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <span class="courses-organizer">
          <v-card
            max-width="400"
            v-for="course in ownCourses"
            :key="course.id"
            class="course-card"
            @click="() => router.push(`/courses/${course.id}`)"
          >
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
        </span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import useUserStore from "~/contexts/userStore";
import UserServices from "~/services/user-services";
import CourseModel from "~/models/courseModel";

const userStore = useUserStore();
const services = new UserServices();
const ownCourses = useState("account-own_courses", () => <CourseModel[]>[]);
const router = useRouter();

// Execute API only if userStore.userData.id is different of ''
watch(
  () => userStore.userData.id,
  async (newValue, oldValue) => {
    if (newValue !== "") {
      const data = await services.getCreatedCourses(userStore.userData.id!);
      ownCourses.value = data;
    }
  }
);

onMounted(async () => {
  if (userStore.userData.id !== "") {
    const data = await services.getCreatedCourses(userStore.userData.id!);
    ownCourses.value = data;
  }
});
</script>
