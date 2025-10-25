const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');


let products = []; // Temporary in-memory store

exports.getAllProducts = (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;

  let result = products;

  if (category) {
    result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  const start = (parseInt(page) - 1) * parseInt(limit);
  const end = start + parseInt(limit);
  const paginated = result.slice(start, end);

  res.json({
    total: result.length,
    page: parseInt(page),
    limit: parseInt(limit),
    data: paginated
  });
};

exports.getProductById = (req, res, next) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) throw new NotFoundError('Product not found');
    res.json(product);
  } catch (err) {
    next(err); // Pass error to global error handler
  }
};

exports.createProduct = (req, res, next) => {
  try {
    const { name, description, price, category, inStock } = req.body;

    if (
      typeof name !== 'string' ||
      typeof description !== 'string' ||
      typeof price !== 'number' ||
      typeof category !== 'string' ||
      typeof inStock !== 'boolean'
    ) {
      throw new ValidationError('Invalid product data');
    }

    const newProduct = {
      id: Date.now().toString(),
      name,
      description,
      price,
      category,
      inStock
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, inStock } = req.body;
  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  product.name = name ?? product.name;
  product.description = description ?? product.description;
  product.price = price ?? product.price;
  product.category = category ?? product.category;
  product.inStock = inStock ?? product.inStock;

  res.json(product);
};

exports.deleteProduct = (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Product not found' });

  products.splice(index, 1);
  res.json({ message: 'Product deleted' });
};

exports.searchProductsByName = (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ message: 'Search term is required' });
  }

  const result = products.filter(p =>
    p.name.toLowerCase().includes(name.toLowerCase())
  );

  res.json(result);
};

exports.getProductStats = (req, res) => {
  const stats = {};

  products.forEach(p => {
    stats[p.category] = (stats[p.category] || 0) + 1;
  });

  res.json(stats);
};
