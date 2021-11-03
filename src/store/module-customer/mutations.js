// src/store/showcase/mutations.js
export const updateCustomerName = (customer, customerEdited) => {
  customer.updateCustomerName = customerEdited;
};

// src/store/showcase/state.js
// Always use a function to return state if you use SSR
// eslint-disable-next-line func-names
export default function () {
  return {
    updateCustomerName,
  };
}
