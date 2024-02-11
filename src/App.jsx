import React, { useState, useEffect } from 'react';
import { supabase } from './createClient';
import 'jspdf-autotable';
import jsPDF from 'jspdf';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const App = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({ name: '', quantity: '', price: '' });
  const [product2, setProduct2] = useState({ id: '', name: '', quantity: '', price: '', category: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*');
    setAllProducts(data);
    setProducts(data);
  }

  function handleChange(event) {
    setProduct((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  }

  function handleChange2(event) {
    setProduct2((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  }

  async function createProduct() {
    await supabase
      .from('products')
      .insert({ name: product.name, quantity: product.quantity, price: product.price, category: product.category });

    fetchProducts();
  }

  async function deleteProduct(productId) {
    const { data, error } = await supabase.from('products').delete().eq('id', productId);

    fetchProducts();

    if (error) {
      console.log(error);
    }

    if (data) {
      console.log(data);
    }
  }

  function displayProduct(productId) {
    allProducts.map((product) => {
      if (product.id === productId) {
        setProduct2({
          id: product.id,
          name: product.name,
          quantity: product.quantity,
          price: product.price,
          category: product.category,
        });
      }
    });
  }

  async function updateProduct(productId) {
    const { data, error } = await supabase
      .from('products')
      .update({
        id: product2.id,
        name: product2.name,
        quantity: product2.quantity,
        price: product2.price,
        category: product2.category,
      })
      .eq('id', productId);

    fetchProducts();

    if (error) {
      console.log(error);
    }

    if (data) {
      console.log(data);
    }
  }

  const generatePDF = () => {
    const pdf = new jsPDF();
    let yPos = 10; // Posición vertical inicial
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    const columnas = ['Id', 'Producto', 'Cantidad', 'Precio', 'Categoria']; // Encabezados de la tabla
    const data = products.map((product) => [product.id, product.name, product.quantity, '$' + product.price, product.category]); // Contenido de la tabla

    // Imprimir encabezados de la tabla
    pdf.setFontSize(14); // Establecer el tamaño de fuente
    pdf.text('Informe de Productos', 80, yPos);
    yPos += 10; // Aumentamos la posición vertical para la siguiente línea
    pdf.setFontSize(10); // Establecer el tamaño de fuente
    pdf.text('Fecha: ' + new Date().toLocaleDateString(), 10, yPos);
    yPos += 10;
    pdf.text('Hora: ' + new Date().toLocaleTimeString(), 10, yPos);
    yPos += 10;

    pdf.autoTable({
      startY: yPos,
      head: [columnas],
      body: data,
    })

    /*
        // Imprimir información de cada producto
        products.forEach((product) => {
    
          yPos += 10; // Aumentar la posición vertical para la siguiente línea
          pdf.text(`ID: ${product.id}`, 15, yPos); // ID del producto
      
          yPos += 10;
          pdf.text(`Nombre: ${product.name}`, 15, yPos); // Nombre del producto
      
          yPos += 10;
          pdf.text(`Precio: ${product.price}`, 15, yPos); // Precio del producto
    
          yPos += 10;
          pdf.text(`Categoria: ${product.category}`, 15, yPos); // Precio del producto
    
          yPos += 10;
          pdf.text(`Cantidad: ${product.quantity}`, 15, yPos); // Precio del producto
        });
      */
    pdf.save(`informe_F:${date}_H:${time}.pdf`);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchProduct = () => {
    const filteredProducts = allProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredProducts.length === 0) {
      setError('Producto no disponible, no se encontró un producto con ese nombre');
    } else {
      setError('');
    }

    setProducts(filteredProducts);
  };

  const listAllProducts = () => {
    setProducts(allProducts);
    setSearchTerm('');
    setSelectedCategory('');
    setError('');
  };

  const handleCategoryChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedCategory(selectedValue);

    if (selectedValue === '') {
      // Si se selecciona la opción vacía, mostrar todos los productos
      listAllProducts();
    } else {
      // Filtrar productos por categoría seleccionada
      const filteredByCategory = allProducts.filter((product) => product.category === selectedValue);
      setProducts(filteredByCategory);
    }
  };

  return (
    <div>
      {/* CREAR LOS PRODUCTOS */}
      {/* FORM 1 */}
      <form onSubmit={createProduct} autocomplete="off">
        <div class='caja'>
          <label>Producto:</label>
          <input required type="text" name="name" onChange={handleChange} />
          <label>Cantidad:</label>
          <input required type="text" name="quantity" onChange={handleChange} />
          <label>Precio:</label>
          <input required type="text" name="price" onChange={handleChange} />
          <label>Categoria:</label>
          <select required name="category" onChange={handleChange}>
            <option value="" disabled selected>
              Selecciona una categoría
            </option>
            <option value="alimentos">Alimentos</option>
            <option value="bebidas">Bebidas</option>
            <option value="limpieza">Articulos de Limpieza</option>
            <option value="tecnologia">Electronicos</option>
            <option value="herramientas">Herramientas</option>
          </select>
        </div>
        <button class="submit" type="submit">Crear Producto</button>
      </form>

      {/* FORM 2 */}
      <form id='form-editar' onSubmit={() => updateProduct(product2.id)} autocomplete="off">
        <div class='caja'>
          <label>Nombre:</label>
          <inpu
            type="text"
            name="name"
            onChange={handleChange2}
            defaultValue={product2.name}
          />
          <label>Cantidad:</label>
          <input
            type="text"
            name="quantity"
            onChange={handleChange2}
            defaultValue={product2.quantity}
          />
          <label>Precio:</label>
          <input
            type="text"
            name="price"
            onChange={handleChange2}
            defaultValue={product2.price}
          />
          <label>Categoria:</label>
          {/* Nuevo campo de categoría en el formulario de edición */}
          <select name="category" onChange={handleChange2} defaultValue={product2.category}>
            <option value="" disabled selected>
              Selecciona una categoría
            </option>
            <option value="alimentos">Alimentos</option>
            <option value="bebidas">Bebidas</option>
            <option value="limpieza">Articulos de Limpieza</option>
            <option value="tecnologia">Electronicos</option>
            <option value="herramientas">Herramientas</option>
          </select>
        </div>
        <button class="submit" type="submit">Guardar Cambios</button>
      </form>


      {/* Mensaje de error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/*VISTA DEL SISTEMA*/}
      <div class="tablita">
        <table class="tabla" id="tabla">
          <thead>
            <tr>
              <th colspan="2" class="submit1">
                {/* Búsqueda por nombre */}
                <form autocomplete="off">
                  <input
                    class="search-input"
                    required
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  <button class="search1" type="button" onClick={searchProduct}>
                    <i class="fas fa-search"></i>
                  </button>
                </form>
              </th>
              <th colspan="2" class="submit1">
                {/* Botón para listar todos los productos */}
                <button class="submit3" onClick={listAllProducts}>Listar Todos</button>
              </th>
              <th colspan="2" class="submit1">
                {/* Búsqueda por categoría */}
                <form autocomplete="off">
                  <select name="category" onChange={handleCategoryChange} value={selectedCategory}>
                    <option value="" disabled selected>
                      Selecciona una categoría
                    </option>
                    <option value="alimentos">Alimentos</option>
                    <option value="bebidas">Bebidas</option>
                    <option value="limpieza">Articulos de Limpieza</option>
                    <option value="tecnologia">Electronicos</option>
                    <option value="herramientas">Herramientas</option>
                  </select>
                </form>
              </th>
            </tr>
            <tr class="table-primary">
              <th>Id</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio $</th>
              <th>Categoria</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>
                  <button class="submit" onClick={() => displayProduct(product.id)}>Editar</button>
                  <button class="submit2" onClick={() => deleteProduct(product.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th colspan="6" class="submit1">
                <button class="submit3" onClick={generatePDF}>Generar PDF</button>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default App;
