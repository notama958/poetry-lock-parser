import axios from 'axios';

export const postFile = async (formData) => {
  try {
    let config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const res = await axios.post(`/api/v1/upload`, formData, config);
    return res.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};
export const getPackage = async (packageName) => {
  try {
    let keyword = '';
    if (packageName) {
      keyword = packageName;
    }
    const res = await axios.get(`/api/v1/package?search=${keyword}`);
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};
