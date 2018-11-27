
const changeLightShow = type => {
  console.log('type:', type);
  return `Changed lights to ${type}`;
};

module.exports = {
  changeLightShow: changeLightShow
};
