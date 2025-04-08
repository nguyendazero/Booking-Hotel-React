// dateUtils.js
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1; // Tháng (0-11)
  const day = date.getDate(); // Ngày
  const year = date.getFullYear(); // Năm
  return `${day < 10 ? `0${day}` : day}/${
    month < 10 ? `0${month}` : month
  }/${year}`;
};
