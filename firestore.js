// jshint esversion: 8
const db = firebase.firestore();

export async function insert(item) {
  try {
    const response = await db.collection("tareas").add(item);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getItems(uid) {
  try {
    const response = await db
      .collection("tareas")
      .where("userid", "==", uid)
      .get();

    return response.docs.map((item) => item.data());
  } catch (error) {
    throw new Error(error);
  }
}

export async function update(id, completed) {
  try {
    let docId;
    const doc = await db.collection("tareas").where("id", "==", id).get();
    doc.forEach((i) => {
      docId = i.id;
    });

    await db.collection("tareas").doc(docId).update({ completed: completed });
  } catch (error) {
    throw new Error(error);
  }
}
