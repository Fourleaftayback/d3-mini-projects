const convertDateToQuarters = (value) => {
  const val = value.split('-');
  const month = val[1].replace(/^0/, '');
  if (Number(month) < 4) return 'Q1';
  if (Number(month) < 7) return 'Q2';
  if (Number(month) < 10) return 'Q3';
  return 'Q4';
};

const sanitizeNumber = (value) => {
  const num = Math.floor(value).toString();
  return num.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
};

const getChartData = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.log(err);
    return [];
  }
};
