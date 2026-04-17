import subirImagenCloudinary from "../helpers/cloudinaryUploader.js";
import { prisma } from "../server/prisma.js";

export const agregarProducto = async (req, res) => {
  try {
    let imagen_url = "";

    if (req.file) {
      const resultado = await subirImagenCloudinary(req.file.buffer);
      imagen_url = resultado.secure_url;
    } else {
      imagen_url =
        "https://static.vecteezy.com/system/resources/thumbnails/008/015/799/small_2x/illustration-of-no-image-available-icon-template-for-no-image-or-picture-coming-soon-free-vector.jpg";
    }

    const { nombre, precio, stock, descripcion, codigoBarras, categoria } =
      req.body;

    const producto = await prisma.producto.create({
      data: {
        nombre,
        precio,
        stock: Number(stock),
        descripcion,
        codigoBarras,
        imagen: imagen_url,
        categoria: {
          connect: {
            idCategoria: Number(categoria),
          },
        },
      },
    });

    res.status(201).json({
      mensaje: "Producto agregado correctamente",
      producto: producto,
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
    const productos = await prisma.producto.findMany({
      include: {
        categoria: true,
      },
    });

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

    const { nombre, precio, stock, descripcion, categoria } = req.body;

    if (!productoBuscado) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    let imagen_url = productoBuscado.imagen;

    if (req.file) {
      const resultado = await subirImagenCloudinary(req.file.buffer);
      imagen_url = resultado.secure_url;
    }

    const productoActualizado = await prisma.producto.update({
      where: { idProducto: Number(req.params.id) },
      data: {
        nombre,
        precio,
        stock: Number(stock),
        descripcion,
        imagen: imagen_url,
        categoria: {
          connect: {
            idCategoria: Number(categoria),
          },
        },
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

export const agregarCategoriaProducto = async (req, res) => {
  try {
    const nuevaCategoria = await prisma.categoria.create({
      data: req.body,
    });
    res.status(201).json({
      mensaje: "Categoria creada correctamente",
      categoria: nuevaCategoria,
    });
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const listarProductosInicio = async (req, res) => {
  try {
    const productos = await prisma.producto.findMany({
      include: {
        categoria: true,
      },
      take: 8,
      orderBy: {
        idProducto: "desc",
      },
    });
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

export const paginarProductos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [productos, cantidadProductos] = await Promise.all([
      prisma.producto.findMany({
        include: {
          categoria: true,
        },
        skip: skip,
        take: limit,
      }),
      prisma.producto.count(),
    ]);

    res.status(200).json({
      productos: productos,
      paginaActual: page,
      cantidadProductos,
      cantPaginas: Math.ceil(cantidadProductos / limit),
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al listar los productos paginados" });
  }
};

export const filtrarporCategoria = async (req, res) => {
  try {
    const { categoria } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const where = categoria ? { categoriaId: parseInt(categoria) } : {};

    const [productos, cantidadProductos] = await Promise.all([
      prisma.producto.findMany({
        where,
        skip,
        take: limit,
        include: {
          categoria: true,
        },
      }),
      prisma.producto.count({ where }),
    ]);

    res.status(200).json({
      productos,
      paginaActual: page,
      cantidadProductos,
      cantPaginas: Math.ceil(cantidadProductos / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Ocurrio un error al aplicar el filtro" });
  }
};

export const buscarProducto = async (req, res) => {
  try {
    const { nombre } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const where = nombre
      ? { nombre: { contains: nombre, mode: "insensitive" } }
      : {};

    const [productos, cantidadProductos] = await Promise.all([
      prisma.producto.findMany({
        where,
        skip,
        take: limit,
        include: {
          categoria: true,
        },
      }),
      prisma.producto.count({ where }),
    ]);

    res.status(200).json({
      productos,
      paginaActual: page,
      cantidadProductos,
      cantPaginas: Math.ceil(cantidadProductos / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al buscar productos" });
  }
};
export const obtenerProductosDestacados = async (req, res) => {
  try {
    const productosDestacados = await prisma.producto.findMany({
      include: {
        categoria: true,
      },
      take: 4,
      orderBy: { fechaCreacion: "asc" },
    });
    res.status(200).json(productosDestacados);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      mensaje: "Ocurrio un error al obtener los productos destacados",
    });
  }
};
