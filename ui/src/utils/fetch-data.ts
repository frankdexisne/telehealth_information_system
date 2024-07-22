import api from "./api";

const fetchData = async (_url: string) => {
  const { data } = await api.get(_url);

  return data.data;
};

export default fetchData;
