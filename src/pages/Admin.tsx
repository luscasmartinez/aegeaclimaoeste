import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { WeatherInfo } from '../types';
import { Navbar } from '../components/Navbar';
import { Plus, Edit2, Trash2, Calendar, Image, FileText, X } from 'lucide-react';

export function Admin() {
  const [weatherData, setWeatherData] = useState<WeatherInfo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    data: '',
    descricao: '',
    imagensUrl: ['']
  });

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    const q = query(collection(db, 'meteorologia'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const data: WeatherInfo[] = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() } as WeatherInfo);
    });
    setWeatherData(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const imagensValidas = formData.imagensUrl.filter(url => url.trim() !== '');

    if (!formData.data || !formData.descricao || imagensValidas.length === 0) {
      alert('Preencha todos os campos e adicione pelo menos uma imagem');
      return;
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, 'meteorologia', editingId), {
          data: formData.data,
          descricao: formData.descricao,
          imagensUrl: imagensValidas,
          createdAt: Date.now()
        });
      } else {
        await addDoc(collection(db, 'meteorologia'), {
          data: formData.data,
          descricao: formData.descricao,
          imagensUrl: imagensValidas,
          createdAt: Date.now()
        });
      }

      setFormData({ data: '', descricao: '', imagensUrl: [''] });
      setShowForm(false);
      setEditingId(null);
      fetchWeatherData();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar informativo');
    }
  };

  const handleEdit = (weather: WeatherInfo) => {
    setFormData({
      data: weather.data,
      descricao: weather.descricao,
      imagensUrl: weather.imagensUrl
    });
    setEditingId(weather.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este informativo?')) {
      try {
        await deleteDoc(doc(db, 'meteorologia', id));
        fetchWeatherData();
      } catch (error) {
        console.error('Erro ao excluir:', error);
        alert('Erro ao excluir informativo');
      }
    }
  };

  const handleCancel = () => {
    setFormData({ data: '', descricao: '', imagensUrl: [''] });
    setShowForm(false);
    setEditingId(null);
  };

  const addImageInput = () => {
    setFormData({
      ...formData,
      imagensUrl: [...formData.imagensUrl, '']
    });
  };

  const removeImageInput = (index: number) => {
    setFormData({
      ...formData,
      imagensUrl: formData.imagensUrl.filter((_, i) => i !== index)
    });
  };

  const updateImageUrl = (index: number, value: string) => {
    const newUrls = [...formData.imagensUrl];
    newUrls[index] = value;
    setFormData({
      ...formData,
      imagensUrl: newUrls
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8 mb-8 animate-fade-in-up">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Painel Administrativo</h1>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Novo Informativo</span>
              </button>
            )}
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 mb-8 border border-blue-200 dark:border-blue-800 animate-fade-in-up">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
                {editingId ? 'Editar Informativo' : 'Criar Novo Informativo'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-medium mb-2">
                    <Calendar className="w-5 h-5" />
                    <span>Data</span>
                  </label>
                  <input
                    type="text"
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-colors"
                    placeholder="Ex: 05/02/2026"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-medium mb-2">
                    <FileText className="w-5 h-5" />
                    <span>Descrição</span>
                  </label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-colors"
                    placeholder="Descrição detalhada das condições meteorológicas"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-medium mb-2">
                    <Image className="w-5 h-5" />
                    <span>Imagens (Imgur)</span>
                  </label>
                  <div className="space-y-3">
                    {formData.imagensUrl.map((url, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => updateImageUrl(index, e.target.value)}
                          className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-colors"
                          placeholder={`Imagem ${index + 1}: https://i.imgur.com/...`}
                        />
                        {formData.imagensUrl.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImageInput(index)}
                            className="p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addImageInput}
                    className="mt-3 w-full px-4 py-2 border-2 border-dashed border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar outra imagem
                  </button>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 dark:bg-blue-500 text-white py-3 rounded-2xl font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  {editingId ? 'Atualizar' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 py-3 rounded-2xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Informativos Cadastrados</h2>
            {weatherData.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-8">Nenhum informativo cadastrado</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {weatherData.map((weather, index) => (
                  <div
                    key={weather.id}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:shadow-md transition-all duration-200 animate-fade-in-up"
                    style={{ animationDelay: `${0.1 * (index % 8)}s` }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-2">
                          <Calendar className="w-5 h-5" />
                          <span className="font-semibold text-lg">{weather.data}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 mb-3">{weather.descricao}</p>
                        <div className="flex flex-wrap gap-2">
                          {weather.imagensUrl.map((imageUrl, idx) => (
                            <a
                              key={idx}
                              href={imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center space-x-1"
                            >
                              <Image className="w-4 h-4" />
                              <span>Imagem {idx + 1}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(weather)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(weather.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
