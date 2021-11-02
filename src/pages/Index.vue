<template>
  <q-page class="flex flex-center">
    <customers-component title="Uôrdi">
    </customers-component>
  </q-page>
</template>

<script>
import CustomersComponent from 'src/components/CustomersComponent.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { CustomersComponent },
  name: 'PageIndex',
});
</script>
