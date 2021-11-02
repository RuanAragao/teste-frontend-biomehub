<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="max-width: 400px">
      <div>Edit: {{ customer.name }}</div>
      <q-form
        @submit="onSubmit"
        class="q-gutter-md"
        :hidden="loading"
      >
        <q-input
          filled
          v-model="customer.name"
          label="Customer name *"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />

        <q-input
          filled
          type="number"
          v-model="customer.age"
          label="Customer age *"
          lazy-rules
          :rules="[
            val => val !== null && val !== '' || 'Please type your age',
            val => val > 0 && val < 100 || 'Please type a real age'
          ]"
        />

        <q-input
          filled
          v-model="customer.city"
          label="Customer city *"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />

        <div>
          <q-btn
            label="Salvar"
            type="submit"
            color="primary"
          />
          <q-btn
            label="Cancelar"
            type="cancel"
            color="primary"
            flat class="q-ml-sm"
            @click="goBack"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useQuasar, Loading } from 'quasar';
import { api } from '../boot/axios';

const $q = useQuasar();

export default defineComponent({
  name: 'PageCustomerEdit',
  props: {
    id: {
      type: String,
    },
  },
  setup() {
    return {
      loading: ref(false),
    };
  },
  data() {
    return {
      rows: [],
      customer: {
        id: Number,
        name: String,
        age: Number,
        city: String,
      },
    };
  },
  mounted() {
    this.getCustomers();
    // eslint-disable-next-line no-console
    // console.table(this.findById(this.rows));
  },
  methods: {
    getCustomers() {
      this.loading = true;
      Loading.show();
      api.get('/customers')
        .then((response) => {
          this.rows = response.data;
          // eslint-disable-next-line
          // console.table(response.data);
          this.customer = this.findById(this.rows, this.id);
          // eslint-disable-next-line no-console
          // console.table(this.customer);
        })
        .catch(() => {
          $q.notify({
            color: 'negative',
            position: 'top',
            message: 'Loading failed',
            icon: 'report_problem',
          });
        })
        .finally(() => {
          this.loading = false;
          Loading.hide();
        });
    },
    // Simular filtragem pela API
    findById(costumers, id) {
      const finded = costumers.find((costumer) => costumer.id === parseInt(id, 10));
      if (!finded) return false;
      return finded;
    },
    goBack() {
      if (window.history.length > 1) {
        this.$router.go(-1);
      }
      this.$router.push('/');
    },
    onSubmit() {
      this.loading = true;
      api.put(`/customers/${this.customer.id}`)
        .then((response) => {
          // eslint-disable-next-line no-console
          console.log(response.data);
          this.$router.push({ path: '/', params: this.customer.name });
        })
        .catch(() => {
          $q.notify({
            color: 'negative',
            position: 'top',
            message: 'Loading failed',
            icon: 'report_problem',
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
});
</script>
