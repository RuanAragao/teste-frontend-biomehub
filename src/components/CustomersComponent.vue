<template>
  <div id="q-app">
    <div class="q-pa-md">
      <q-table
        title="Lista de Clientes"
        :rows="rows"
        :columns="columns"
        :loading="loading"
        :filter="filter"
        :rows-per-page-options="[10]"
        :grid="$q.screen.lt.md"
        grid-header
        row-key="name"
      >
        <template v-slot:top-right>
          <div class="row q-gutter-sm q-mb-md">
            <q-input dense debounce="300" v-model="filter" placeholder="Pesquisar">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>

            <!-- Button Export to SCV -->
            <q-btn
              color="primary"
              icon-right="archive"
              label="Exportar CSV"
              no-caps
              @click="exportTable"
            />
          </div>
        </template>

        <template v-slot:body-cell-action="props">
          <q-td auto-width :props="props">
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

        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
            <q-card>
              <q-card-section>
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-h6">{{ props.row.name }}</div>
                    <div class="text-subtitle1">{{ props.row.city }}</div>
                  </div>

                  <div class="col-auto">
                    <q-btn
                      color="grey-7"
                      icon-right="edit"
                      no-caps
                      flat
                      dense
                      @click="editVal(rows.indexOf(props.row))"
                    />
                  </div>
                </div>
              </q-card-section>

              <!-- Mobile cards add -->
              <q-separator />

              <q-card-section class="row">
                <div class="text-subtitle2">Idade: {{ props.row.id }}</div>
                <q-space />
                <div class="text-subtitle2">#{{ props.row.id }}</div>
              </q-card-section>

            </q-card>
          </div>
        </template>

      </q-table>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { api } from 'boot/axios';
import {
  useQuasar, Screen, Notify, exportFile,
} from 'quasar';

const $q = useQuasar();

// Format CSV
function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0
    ? formatFn(val)
    : val;

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
}

// Define columns table
const columns = [
  {
    name: 'id', align: 'left', label: 'Id', field: (row) => row.id, sortable: true, required: true,
  },
  {
    name: 'name', align: 'left', label: 'Nome', field: 'name', sortable: true,
  },
  {
    name: 'age', align: 'left', label: 'Idade', field: 'age', sortable: true,
  },
  {
    name: 'city', align: 'left', label: 'Cidade', field: 'city', sortable: true,
  },
  {
    name: 'action', label: 'Editar', field: 'action',
  },
];

export default {
  name: 'CustomersComponent',
  setup() {
    // Setup media queries
    Screen.setSizes(
      {
        sm: 300,
        md: 768, // RF02
        lg: 1000,
        xl: 2000,
      },
    );

    return {
      filter: ref(''),
      loading: ref(false),
      customerEdited: null,
      triggerUpdateNotify() {
        Notify.create({
          type: 'positive',
          position: 'top',
          progress: true,
          timeout: 5000,
          textColor: 'white',
          actions: [{ icon: 'close', color: 'white' }],
          message: `<span class="text-h6 text-weight-light text-center">
                    Cliente <strong>${this.customerEdited}</strong>
                    atualizado com sucesso!</span>`,
          html: true,
          onDismiss: this.onCloseAlert(),
        });
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
    if (localStorage.getItem('customerUpdated')) {
      this.customerEdited = localStorage.getItem('customerUpdated');
      this.triggerUpdateNotify();
    }
  },
  methods: {
    getCustomers() {
      this.loading = true;
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
        })
        .finally(() => {
          this.loading = false;
        });
    },
    editVal(index) {
      this.$router.push({ path: `/edit/${this.rows[index].id}` });
    },
    onCloseAlert() {
      localStorage.removeItem('customerUpdated');
    },
    exportTable() {
      // naive encoding to csv format
      // eslint-disable-next-line no-console
      console.table(columns);
      const content = [columns.map((col) => wrapCsvValue(col.label !== 'Editar' ? col.label : null))].concat(
        this.rows.map((row) => columns.map((col) => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format,
        )).join(',')),
      ).join('\r\n');

      const status = exportFile(
        'lista-de-clientes.csv',
        content,
        'text/csv',
      );

      if (status !== true) {
        $q.notify({
          message: 'Ocorreu um erro ao exportar o CSV',
          color: 'negative',
          icon: 'warning',
        });
      }
    },
  },
};
</script>

<style>

</style>
