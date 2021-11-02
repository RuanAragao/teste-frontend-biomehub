<template class="column">
  <q-page class="row flex flex-center">
    <div class="q-pa-md col-xs-12 col-sm-6 col-md-4" style="max-width: 400px">
      <div>Edit: {{ customer.name }}</div>
      <q-form
        @submit="onSubmit"
        @formchange="validate"
        class="q-gutter-md"
        :hidden="loading"
        ref="formEdit"
      >
        <q-input
          filled
          v-model="customer.name"
          label="Nome *"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Por favor, insira o nome.']"
        />

        <q-input
          filled
          type="number"
          v-model="customer.age"
          label="Idade *"
          lazy-rules
          :rules="[
            val => val !== null && val !== '' || 'Por favor, digite a idade.',
            val => val.length > 0 && val.length <= 3 || 'Por favor, informe uma idade válida.'
          ]"
        />

        <q-input
          filled
          v-model="customer.city"
          label="Cidade *"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Por favor, insira a cidade.']"
        />

        <div>
          <q-btn
            label="Salvar"
            type="submit"
            color="primary"
            :disable="btnDisabled"
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
    // to reset validations:
    // eslint-disable-next-line no-unused-vars
    // function reset() {
    //   formEdit.value.resetValidation();
    // }

    return {
      loading: ref(false),
      formEdit: ref(null),
      btnDisabled: null,
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
    validate() {
      // eslint-disable-next-line
      console.log("validate");
      this.formEdit.value.validate().then((success) => {
        if (success) {
          this.btnDisabled = false;
        } else {
          this.btnDisabled = true;
        }
      });
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
