
const setLightMode = type => {
  console.log('type:', type);
  return `Changed lights to ${type}`;
};

module.exports = {
  setLightMode: setLightMode
};
