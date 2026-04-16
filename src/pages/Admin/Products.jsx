import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { 
  Package, Plus, Trash2, Image as ImageIcon, 
  Tag, Info, Loader2, ArrowLeft, Upload, X, Search
} from "lucide-react";
import { Link } from "react-router-dom";
import ConfirmModal from "../../components/ConfirmModal";

export default function AdminProducts({ setToast }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "Handcrafted with premium yarn",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error.message);
      setToast("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
         setToast("File too large. Max 2MB.");
         return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !imageFile) {
      setToast("Please fill all fields and select an image");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload Image
      const imageUrl = await uploadImage(imageFile);

      // 2. Save Product
      const { error } = await supabase
        .from("products")
        .insert([
          {
            name: form.name,
            price: parseFloat(form.price),
            description: form.description,
            img: imageUrl
          }
        ]);

      if (error) throw error;

      setToast("Product added successfully!");
      setForm({ name: "", price: "", description: "Handcrafted with premium yarn" });
      setImageFile(null);
      setImagePreview(null);
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error.message);
      setToast(`Failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const initiateDelete = (id, imageUrl) => {
    setProductToDelete({ id, imageUrl });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      // 1. Delete from database
      const { error: dbError } = await supabase
        .from("products")
        .delete()
        .eq("id", productToDelete.id);

      if (dbError) throw dbError;

      // 2. Try to delete from storage if it's a Supabase URL
      if (productToDelete.imageUrl && productToDelete.imageUrl.includes('supabase.co/storage/v1/object/public/products/')) {
        try {
          const filePath = productToDelete.imageUrl.split('products/').pop();
          const { error: storageError } = await supabase.storage.from('products').remove([filePath]);
          if (storageError) console.warn("Storage cleanup failed:", storageError.message);
        } catch (storageErr) {
          console.warn("Storage removal logic error:", storageErr);
        }
      }

      setToast("Product deleted successfully!");
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      setToast(`Delete Failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffcf7] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <Link to="/admin" className="text-brand flex items-center gap-1 text-sm font-bold mb-2 hover:underline">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
              <Package className="text-brand" size={32} />
              Product Management
            </h1>
            <p className="text-gray-500 mt-1">Manage your storefront dynamically</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-orange-100 rounded-2xl w-full sm:w-64 focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all shadow-sm font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Product Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-orange-50 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Plus className="text-brand" size={20} />
                Add New Product
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Product Name</label>
                  <input 
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    placeholder="e.g. Multicolor Muffler"
                    className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:ring-4 focus:ring-brand/10 focus:bg-white focus:border-brand transition-all outline-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Price (₹)</label>
                  <input 
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({...form, price: e.target.value})}
                    placeholder="699"
                    className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:ring-4 focus:ring-brand/10 focus:bg-white focus:border-brand transition-all outline-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Short Description</label>
                  <textarea 
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    placeholder="Handcrafted with premium yarn"
                    rows="2"
                    className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:ring-4 focus:ring-brand/10 focus:bg-white focus:border-brand transition-all outline-none font-medium resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Product Image</label>
                  <div className="relative group">
                    {imagePreview ? (
                      <div className="relative rounded-2xl overflow-hidden aspect-video border-2 border-brand/20">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => {setImageFile(null); setImagePreview(null);}}
                          className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-md"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full px-4 py-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-brand/5 hover:border-brand/40 transition-all group">
                        <Upload className="text-gray-400 mb-2 group-hover:text-brand transition-colors" size={24} />
                        <p className="text-xs font-bold text-gray-500 group-hover:text-brand transition-colors">Select from device</p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">Max 2MB (JPG, PNG)</p>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden" 
                          onChange={handleFileChange}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-brand/20 hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                  {isSubmitting ? "Uploading..." : "Add Product"}
                </button>
              </form>
            </div>
          </div>

          {/* Product List */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products
                .filter(p => 
                  p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  p.description.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((product) => (
                <div key={product.id} className="bg-white p-4 rounded-3xl border border-orange-50 shadow-sm flex gap-4 group hover:shadow-md transition-all">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                    <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="font-bold text-gray-800 line-clamp-1">{product.name}</h3>
                      <p className="text-brand font-black">₹{product.price}</p>
                      <p className="text-xs text-gray-400 line-clamp-1 italic">{product.description}</p>
                    </div>
                    <button 
                      onClick={() => initiateDelete(product.id, product.img)}
                      className="flex items-center gap-1 text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-widest mt-2"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              ))}

              {products.filter(p => 
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                p.description.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 && !loading && (
                <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-orange-100">
                  <Package className="mx-auto mb-4 text-gray-200" size={64} />
                  <h3 className="text-xl font-bold text-gray-400">
                    {searchTerm ? "No matching products" : "No products found"}
                  </h3>
                  <p className="text-gray-400">
                    {searchTerm ? "Try a different search term" : "Add your first product to get started"}
                  </p>
                </div>
              )}

              {loading && (
                 <div className="col-span-full py-20 flex justify-center">
                    <Loader2 className="animate-spin text-brand" size={40} />
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        title="Delete Product?"
        message="This will permanently remove the product from your store and storage. This action cannot be undone."
      />
    </div>
  );
}
