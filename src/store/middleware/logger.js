// SNA = Store Next Action
// To make parameterized middle add parameter before store
// as middleware in configureStore expects a function s=>n=>a
// here logger with param returns a function s=>n=>a
const logger = (param) => (store) => (next) => (action) => {
  console.log(`Logging: ${param} and Action: ${action.type}`);
  next(action);
};

export default logger;
