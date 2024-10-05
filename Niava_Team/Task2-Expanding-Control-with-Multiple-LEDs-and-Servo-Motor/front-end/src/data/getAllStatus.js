import axios from "axios";

export const getAllData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/led");
    return response.data.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// export const getAllData = async () => {
//   try {
//     let recieved;
//     const response = await axios
//       .get("http://localhost:5000/api/led")
//       .then((res) => res.json())
//       .then((data) => (recieved = data.data.data));
//     return recieved;
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// };
