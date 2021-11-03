<template class="column">
  <q-page class="row flex flex-center">
    <div class="q-pa-md col-xs-12 col-sm-6 col-md-4" style="max-width: 400px">
      <h1 class="text-h4 q-pb-md">
        Editar cliente
      </h1>
      <q-form
        @submit="onSubmit"
        @formchange="validate"
        class="q-gutter-md"
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

  <loading-component v-show="loading" />

</template>

<script>
import LoadingComponent from 'src/components/LoadingComponent.vue';
import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar';
import { api } from '../boot/axios';

const $q = useQuasar();

export default defineComponent({
  components: { LoadingComponent },
  name: 'PageCustomerEdit',
  props: {
    id: {
      type: String,
    },
  },
  data() {
    return {
      loading: ref(false),
      btnDisabled: null,
      formEdit: ref(),
      rows: [],
      customer: {
        id: null,
        name: null,
        age: null,
        city: null,
      },
    };
  },
  mounted() {
    this.getCustomers();
  },
  methods: {
    getCustomers() {
      this.loading = true;
      api.get('/customers')
        .then((response) => {
          this.rows = response.data;
          this.customer = this.findById(this.rows, this.id);
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
    // Simular filtragem pela API
    findById(costumers, id) {
      const finded = costumers.find((costumer) => costumer.id === parseInt(id, 10));
      if (!finded) return false;
      return finded;
    },
    validate() {
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
          localStorage.setItem('customerUpdated', this.customer.name);
          this.$router.push({ path: '/' });
          // set: this.$store.state.customer.name;
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
