import { prisma } from "../server/prisma.js";

export const agregarProducto = async (req, res) => {
  try {
    const nuevoProducto = await prisma.producto.create({
      data: req.body,
    });
    res.status(201).json({
      mensaje: "Producto agregado exitosamente",
      producto: nuevoProducto,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al agregar el producto" });
  }
};

export const listarProductos = async (req, res) => {
  try {
    const productos = await prisma.producto.findMany();

    if (!productos) {
      return res.status(404).json({ mensaje: "No hay productos para listar" });
    }
    res.status(200).json(productos);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al listar los productos" });
  }
};

export const obtenerProductoID = async (req, res) => {
  try {
    const productoBuscado = await prisma.producto.findUnique({
      where: { idProducto: Number(req.params.id) },
    });

    if (!productoBuscado) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.status(200).json(productoBuscado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Ocurrio un error al listar el producto" });
  }
};

export const actualizarDatosProducto = async (req, res) => {
  try {
    const productoBuscado = await prisma.producto.findUnique({
      where: { idProducto: Number(req.params.id) },
    });

    const { nombre, precio, stock, descripcion, imagen } = req.body;

    if (!productoBuscado) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    const productoActualizado = await prisma.producto.update({
      where: { idProducto: Number(req.params.id) },
      data: {
        nombre,
        precio,
        stock,
        descripcion,
        imagen,
      },
    });
    res.status(200).json({
      mensaje: "Producto actualizado exitosamente",
      producto: productoActualizado,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      mensaje: "Ocurrio un error al actualizar los datos del producto",
    });
  }
};

export const cambiarEstadoProducto = async (req, res) => {
  try {
    const producto = await prisma.producto.findUnique({
      where: { idProducto: Number(req.params.id) },
    });

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    const nuevoEstado =
      producto.estado === "DISPONIBLE" ? "INACTIVO" : "DISPONIBLE";

    const productoActualizado = await prisma.producto.update({
      where: { idProducto: Number(req.params.id) },
      data: { estado: nuevoEstado },
    });
    res.status(200).json({
      mensaje: "Estado del producto actualizado exitosamente",
      producto: productoActualizado,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al cambiar el estado del producto" });
  }
};
