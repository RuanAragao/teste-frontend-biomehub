<template>
  <div id="q-app">
    <div class="q-pa-md">
      <q-toggle v-model="loading" label="Loading state" class="q-mb-md" />
      <q-table
        title="Customers List"
        :rows="rows"
        :columns="columns"
        row-key="name"
        :loading="loading"
      >
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <q-btn
            color="blue"
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
  props: {
    title: {
      type: String,
    },
  },
  setup() {
    return {
      loading: ref(false),
      pagination: {
        rowsPerPage: 10,
      },
      paginationControl: {
        rowsPerPage: 10,
      },
      initialPagination: {
        rowsPerPage: 10,
      },
    };
  },
  data() {
    return {
      submitted: false,
      columns,
      rows: [],
    };
  },
  mounted() {
    this.getCustomers();
  },
  methods: {
    getCustomers() {
      api.get('/customers')
        .then((response) => {
          this.rows = response.data;
          // eslint-disable-next-line
          // console.table(response.data);
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
      // eslint-disable-next-line no-console
      console.log(this.rows[index].id);
      // this.rows.splice(index, 1);
      // eslint-disable-next-line no-console
      console.log(this.rows);
      this.$router.push({ path: `/edit/${this.rows[index].id}` });
    },
  },
};
</script>

<style>

</style>
