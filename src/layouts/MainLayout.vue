<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>

        <q-avatar>
          <img src="../assets/logo-w.png">
        </q-avatar>

        <q-toolbar-title>
          <span class="text-weight-regular">BIOME</span><span class="text-weight-thin">HUB</span>
        </q-toolbar-title>

      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',
});
</script>
