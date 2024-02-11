import React, { useState, useEffect } from 'react';
import { supabase } from './createClient';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './App.css';

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
    const pdfContent = document.getElementById('pdf-content');

    // Guardar el estilo actual y mostrar el elemento temporalmente
    const prevDisplayStyle = pdfContent.style.display;
    pdfContent.style.display = 'block';

    html2canvas(pdfContent).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      // Crear un nuevo objeto jsPDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();

      // Agregar la imagen al PDF
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);

      // Guardar el PDF con el nombre 'informe.pdf'
      pdf.save('informe.pdf');

      // Restaurar el estilo original después de generar el PDF
      pdfContent.style.display = prevDisplayStyle;
    });
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
      <form onSubmit={createProduct}>
        <input type="text" placeholder="Producto" name="name" onChange={handleChange} />
        <input type="text" placeholder="Cantidad Total" name="quantity" onChange={handleChange} />
        <input type="text" placeholder="Precio Unitario" name="price" onChange={handleChange} />
        <select name="category" onChange={handleChange}>
          <option value="" disabled selected>
            Selecciona una categoría
          </option>
          <option value="alimentos">Alimentos</option>
          <option value="bebidas">Bebidas</option>
          <option value="limpieza">Articulos de Limpieza</option>
          <option value="tecnologia">Electronicos</option>
          <option value="herramientas">Herramientas</option>
        </select>
        <button type="submit">Crear Producto</button>
      </form>

      {/* FORM 2 */}
      <form onSubmit={() => updateProduct(product2.id)}>
        <input
          type="text"
          placeholder="Producto a editar"
          name="name"
          onChange={handleChange2}
          defaultValue={product2.name}
        />
        <input
          type="text"
          placeholder="Cantidad a editar"
          name="quantity"
          onChange={handleChange2}
          defaultValue={product2.quantity}
        />
        <input
          type="text"
          placeholder="Precio a editar"
          name="price"
          onChange={handleChange2}
          defaultValue={product2.price}
        />

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

        <button type="submit">Guardar Cambios</button>
      </form>

      {/* Botón para generar informe en PDF */}
      <button onClick={generatePDF}>Generar Informe PDF</button>

      {/* Búsqueda por nombre */}
      <form>
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button type="button" onClick={searchProduct}>
          Buscar
        </button>
      </form>

      {/* Búsqueda por categoría */}
      <form>
        <select name="category" onChange={handleCategoryChange} value={selectedCategory}>
          <option value="" disabled selected>
            Selecciona una categoría para filtrar
          </option>
          <option value="alimentos">Alimentos</option>
          <option value="bebidas">Bebidas</option>
          <option value="limpieza">Articulos de Limpieza</option>
          <option value="tecnologia">Electronicos</option>
          <option value="herramientas">Herramientas</option>
        </select>
      </form>

      {/* Botón para listar todos los productos */}
      <button onClick={listAllProducts}>Listar Todos</button>

      {/* Mensaje de error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/*VISTA DEL SISTEMA*/}
      <div id="system-content">
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
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
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>
                  <button onClick={() => deleteProduct(product.id)}>Eliminar</button>
                  <button onClick={() => displayProduct(product.id)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*VISTA DEL DOCUMENTO PDF*/}
      <div id="pdf-content" className="hidden">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
