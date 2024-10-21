import axios from "axios";
import { fakeData } from "./fakeData";

export const getAllData = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/led");
        if (response.data.data == null) {
            return {
                data: fakeData,
                err: true,
            };
        }
        return {
            data: response.data.data,
            err: false,
        };
    } catch (err) {
        return {
            data: fakeData,
            err: true,
        };
    }
};
