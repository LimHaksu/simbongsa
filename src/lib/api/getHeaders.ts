import storage from "lib/storage";

export default () => {
    const token = "Bearer " + storage.get("token");
    return { Authorization: token }
};