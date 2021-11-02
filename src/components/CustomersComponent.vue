<template>
  <div id="q-app">
    <div class="q-pa-md">
      <q-toggle v-model="loading" label="Simular carregamento" class="q-mb-md" />
      <q-table
        title="Lista de Clientes"
        :rows="rows"
        :columns="columns"
        :loading="loading"
        :filter="filter"
        :rows-per-page-options="[10]"
        row-key="name"
      >
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <q-btn
            color="primary"
            icon-right="edit"
            no-caps
            flat
            dense
            @click="editVal(rows.indexOf(props.row))"
          />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const columns = [
  {
    name: 'id', align: 'left', label: 'Id', field: (row) => row.id, sortable: true, required: true,
  },
  {
    name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true,
  },
  {
    name: 'age', align: 'left', label: 'Age', field: 'age', sortable: true,
  },
  {
    name: 'city', align: 'left', label: 'City', field: 'city', sortable: true,
  },
  {
    name: 'action', label: 'Action', field: 'action',
  },
];

export default {
  name: 'CustomersComponent',
  params: {
    name: {
      type: String,
    },
  },
  setup() {
    return {
      filter: ref(''),
      loading: ref(false),
    };
  },
  data() {
    return {
      submitted: false,
      customer: {
        name: String,
      },
      columns,
      rows: [],
    };
  },
  mounted() {
    this.getCustomers();
    // eslint-disable-next-line no-console
    console.log(this.$route.params);
  },
  methods: {
    getCustomers() {
      api.get('/customers')
        .then((response) => {
          this.rows = response.data;
        })
        .catch(() => {
          $q.notify({
            color: 'negative',
            position: 'top',
            message: 'Loading failed',
            icon: 'report_problem',
          });
        });
    },
    editVal(index) {
      this.$router.push({ path: `/edit/${this.rows[index].id}` });
    },
  },
};
</script>

<style>

</style>
