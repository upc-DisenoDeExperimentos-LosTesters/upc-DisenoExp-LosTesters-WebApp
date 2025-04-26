<script>
import Sidebar from "../components/sidebar.component.vue";
import homeDriverComponent from "../../profiles-managment/components/home-driver.component.vue";

export default {
  name: "Businessman-Profile",
  components: {
    homeDriverComponent,
    Sidebar
  },
}
</script>

<template>
  <div class="container">
    <sidebar></sidebar>
    <home-driver-component/>
  </div>
</template>

<style>
.container{
  display: flex;
}
</style>