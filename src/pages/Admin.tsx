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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                <Plus className="w-5 h-5" />
                <span>Novo Informativo</span>
              </button>
            )}
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {editingId ? 'Editar Informativo' : 'Criar Novo Informativo'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2 text-gray-700 font-medium mb-2">
                    <Calendar className="w-5 h-5" />
                    <span>Data</span>
                  </label>
                  <input
                    type="text"
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 05/02/2026"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-gray-700 font-medium mb-2">
                    <FileText className="w-5 h-5" />
                    <span>Descrição</span>
                  </label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descrição detalhada das condições meteorológicas"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-gray-700 font-medium mb-2">
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
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Imagem ${index + 1}: https://i.imgur.com/...`}
                        />
                        {formData.imagensUrl.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImageInput(index)}
                            className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition"
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
                    className="mt-3 w-full px-4 py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition font-medium flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar outra imagem
                  </button>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  {editingId ? 'Atualizar' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Informativos Cadastrados</h2>
            {weatherData.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhum informativo cadastrado</p>
            ) : (
              weatherData.map((weather) => (
                <div
                  key={weather.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 text-blue-600 mb-2">
                        <Calendar className="w-5 h-5" />
                        <span className="font-semibold text-lg">{weather.data}</span>
                      </div>
                      <p className="text-gray-700 mb-3">{weather.descricao}</p>
                      <div className="flex flex-wrap gap-2">
                        {weather.imagensUrl.map((imageUrl, idx) => (
                          <a
                            key={idx}
                            href={imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm flex items-center space-x-1"
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
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(weather.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
