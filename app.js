const express = require("express");
const Sequelize = require("sequelize");

// Configuración de la conexión a la base de datos
const sequelize = new Sequelize("prueba", "Victor", "Vl220503", {
  host: "localhost",
  ///host: "DESKTOP-N7S798M\SQLEXPRESS",
  dialect: "mssql",
  port: "1433", 
});

// Definición del modelo de Tarea
const Tarea = sequelize.define("Tarea", {
  // Definición de las columnas de la tabla
  nombre: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  descripcion: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  estado: {
    type: Sequelize.ENUM("pendiente", "en_progreso", "completa"),
    allowNull: false,
    defaultValue: "pendiente",
  },
});

// Sincronización del modelo con la base de datos
sequelize
  .sync()
  .then(() => {
    console.log(
      "Modelo 'Tarea' sincronizado correctamente con la base de datos."
    );
  })
  .catch((err) => {
    console.error(
      "Error al sincronizar el modelo 'Tarea' con la base de datos:",
      err
    );
  });

// Crear una instancia de Express
const app = express();
app.use(express.json());

// Endpoint para obtener todas las tareas
app.get("/api/tareas", async (req, res) => {
  try {
    const tareas = await Tarea.findAll();
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las tareas." });
  }
});

// Endpoint para crear una nueva tarea
app.post("/api/tareas", async (req, res) => {
  const { nombre, descripcion, estado } = req.body;
  try {
    const nuevaTarea = await Tarea.create({ nombre, descripcion, estado });
    res.status(201).json(nuevaTarea);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la tarea." });
  }
});

// Endpoint para actualizar una tarea por ID
app.put("/api/tareas/:id", async (req, res) => {
  const id = req.params.id;
  const nuevosDatos = req.body;
  try {
    const tarea = await Tarea.findByPk(id);
    if (!tarea) {
      return res.status(404).json({ error: "Tarea no encontrada." });
    }
    await tarea.update(nuevosDatos);
    res.json(tarea);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la tarea." });
  }
});

// Endpoint para eliminar una tarea por ID
app.delete("/api/tareas/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const tarea = await Tarea.findByPk(id);
    if (!tarea) {
      return res.status(404).json({ error: "Tarea no encontrada." });
    }
    await tarea.destroy();
    res.json({ message: "Tarea eliminada correctamente." });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la tarea." });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
