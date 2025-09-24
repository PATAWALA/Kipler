import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function NousContacter() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
        <Mail className="text-red-500" /> Nous Contacter
      </h2>

      {/* Infos de contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center">
          <Phone className="text-green-500 mb-2" size={28} />
          <p className="font-semibold text-gray-800">Téléphone</p>
          <span className="text-gray-600 text-sm">+229 0146495875</span>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center">
          <Mail className="text-blue-500 mb-2" size={28} />
          <p className="font-semibold text-gray-800">Email</p>
          <span className="text-gray-600 text-sm">patawalaabdoulaye1900@gmail.com</span>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center">
          <MapPin className="text-purple-500 mb-2" size={28} />
          <p className="font-semibold text-gray-800">Ouaké , Wèkètè .</p>
          <span className="text-gray-600 text-sm">Ouaké,Bénin</span>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-8 overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Envoyer un message</h3>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Votre nom"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <input
            type="email"
            placeholder="Votre email"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <textarea
            placeholder="Votre message"
            rows={4}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <Send size={18} /> Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}
