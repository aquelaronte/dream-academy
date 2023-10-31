<template>
  <v-menu open-on-hover>
    <template v-slot:activator="{ props }">
      <v-btn
        icon="mdi-plus"
        v-bind="props"
        id="courses-menu"
        color="red-lighten-1"
      ></v-btn>
    </template>

    <v-tooltip text="Nueva notificación">
      <template v-slot:activator="{ props }">
        <v-btn
          icon="mdi-newspaper"
          color="brown-lighten-1"
          class="mb-3"
          v-bind="props"
        ></v-btn>
      </template>
    </v-tooltip>
    <v-tooltip text="Nuevo item">
      <template v-slot:activator="{ props }">
        <v-btn
          icon="mdi-note"
          color="green-lighten-1"
          class="mb-3"
          v-bind="props"
        ></v-btn>
      </template>
    </v-tooltip>
    <v-tooltip text="Nuevo curso">
      <template v-slot:activator="{ props }">
        <NuxtLink to="/account/new-course">
          <v-btn
            icon="mdi-book-cross"
            color="teal-lighten-1"
            class="mb-3"
            v-bind="props"
          >
          </v-btn>
        </NuxtLink>
      </template>
    </v-tooltip>
  </v-menu>
</template>

<style scoped>
#courses-menu {
  position: fixed;
  right: 30px;
  bottom: 30px;
  z-index: 999;
}
</style>
