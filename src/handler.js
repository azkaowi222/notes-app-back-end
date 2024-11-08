const { nanoid } = require("nanoid");
const notes = require("./notes.js");
const getAllNotesHandler = () => ({
  status: "success",
  data: {
    notes,
  },
});

const getNoteByIdHandler = (req, h) => {
  const { id } = req.params;
  const note = notes.filter((n) => n.id === id)[0];
  if (!note) {
    return h
      .response({
        status: "fail",
        message: "Catatan tidak ditemukan",
      })
      .code(404);
  }
  return h.response({
    status: "succes",
    message: `Catatan untuk id: ${id}`,
    data: {
      note,
    },
  });
};

const addNoteHandler = (req, h) => {
  const { title, tags, body } = req.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const newNote = {
    title,
    tags,
    body,
    id,
    createdAt,
    updatedAt,
  };
  notes.push(newNote);
  const isSuccess = notes.find((item) => newNote.id === item.id);
  if (!isSuccess) {
    return h
      .response({
        status: "fail",
        message: "Catatan gagal ditambahkan",
      })
      .code(400);
  }
  return h
    .response({
      status: "success",
      message: "Catatan berhasil ditambahkan",
      data: {
        noteId: id,
      },
    })
    .type("application/json")
    .code(201);
};

const editNoteByIdHandler = (req, h) => {
  const { title, tag, body } = req.payload;
  const { id } = req.params;
  const updatedAt = new Date().toISOString();
  const index = notes.findIndex((item) => item.id === id);
  notes[index] = {
    ...notes[index],
    title,
    tag,
    body,
    updatedAt,
  };
  if (notes[index] === -1) {
    return h
      .response({
        status: "fail",
        message: "Gagal memperbarui catatan. Id tidak ditemukan",
      })
      .code(404);
  }
  return h
    .response({
      status: "success",
      message: "Catatan berhasil diperbarui",
    })
    .code(200);
};

const deleteNoteByIdHanler = (req, h) => {
  const { id } = req.params;
  const index = notes.findIndex((item) => item.id === id);
  if (index === -1) {
    return h
      .response({
        status: "fail",
        message: "Gagal menghapus catatan. Id tidak ditemukan",
      })
      .code(404);
  }
  notes.splice(index, 1);
  return h
    .response({
      status: "success",
      message: `Berhasil menghapus catatan dengan id ${id} `,
    })
    .code(200);
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHanler,
};
