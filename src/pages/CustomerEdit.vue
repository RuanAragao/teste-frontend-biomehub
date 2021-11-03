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

<div class="overlay" v-show="loading">
  <div class="overlay__inner">
    <div class="overlay__content">
      <svg xmlns="http://www.w3.org/2000/svg" width="128" height="190.78" viewBox="0 0 287 426" fill="none">
        <path d="M71.5865 102.079C8.07873 192.517 0
        205.053 0 212.664C0 222.962 4.26377 229.23
        16.8307 237.512L26.4803 244.004L35.4566 235.05C40.3937
        230.349 50.4921 223.409 57.8976 220.051C69.118 214.903
        74.2794 213.783 89.3148 213.783C109.063 213.783 117.142
        216.246 138.685 229.23C157.311 240.422 177.059 246.243
        197.256 246.243C206.456 246.243 213.862 246.914 213.862
        247.81C213.862 248.929 210.271 254.078 205.783 259.674C184.913
        286.089 152.823 296.834 122.752 287.656C116.693 285.865 109.287
        284.298 106.146 284.298C98.2912 284.298 87.744 291.238 83.0314
        299.745L78.992 306.684L96.2715 314.967C111.98 322.354 116.244 323.473
        136.665 324.593L159.555 325.712L138.46 355.933C120.957 381.229 117.366
        387.497 117.366 394.66C117.366 406.077 120.059 410.33 132.401 418.837L142.724
        426L147.437 419.732C178.181 378.095 285.448 222.962 286.571 218.261C288.815
        209.754 282.082 197.666 270.637 189.607L261.212 182.891L251.787 191.174C233.161
        208.187 207.578 215.35 184.24 210.649C177.283 209.082 164.492 203.71 155.291
        198.113C132.177 184.234 113.551 178.414 92.2322 178.19C82.5826 177.966 74.7283
        177.295 74.7283 176.399C74.7283 172.146 99.4133 148.865 109.287 143.94C124.098
        136.329 151.027 134.314 168.531 139.463C175.039 141.478 181.996 142.597 184.24
        141.925C193.665 138.791 198.602 135.21 203.09 128.046C208.252 119.54 208.476
        119.764 193.665 112.152C180.201 105.213 168.531 102.303 148.334 100.96L128.586
        99.6164L149.008 70.7388C169.878 41.1897 173.468 32.6831 169.205 21.938C167.409
        16.7893 148.334 0.223846 144.295 0C143.622 0 110.858 45.8907 71.5865 102.079Z"
        fill="none" stroke="#ffffff" class="logo-loading" stroke-width="3">
        </path>
      </svg>
    </div>
  </div>
</div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar';
import { api } from '../boot/axios';

const $q = useQuasar();

export default defineComponent({
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
