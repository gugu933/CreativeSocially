import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Models = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Dummy data instead of API call
    const dummyModels = [
      {
        _id: '1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        height: 175,
        dateOfBirth: '1998-04-15',
        gender: 'female',
        experience: '3 years of modeling experience',
        portfolio: [
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop'
        ],
        measurements: {
          bust: '84cm',
          waist: '61cm',
          hips: '89cm'
        },
        socialMedia: {
          instagram: '@sarah.johnson',
          facebook: 'sarahjohnsonmodel',
          twitter: '@sarahj_model'
        },
        status: 'approved'
      },
      {
        _id: '2',
        firstName: 'Michael',
        lastName: 'Chen',
        height: 183,
        dateOfBirth: '1996-08-23',
        gender: 'male',
        experience: '5 years of modeling experience',
        portfolio: [
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop'
        ],
        measurements: {
          bust: '102cm',
          waist: '81cm',
          hips: '98cm'
        },
        socialMedia: {
          instagram: '@michael.chen',
          facebook: 'michaelchenmodel',
          twitter: '@michaelc_model'
        },
        status: 'approved'
      },
      {
        _id: '3',
        firstName: 'Emma',
        lastName: 'Garcia',
        height: 170,
        dateOfBirth: '1999-12-05',
        gender: 'female',
        experience: '2 years of modeling experience',
        portfolio: [
          'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop'
        ],
        measurements: {
          bust: '82cm',
          waist: '59cm',
          hips: '87cm'
        },
        socialMedia: {
          instagram: '@emma.garcia',
          facebook: 'emmagarciamodel',
          twitter: '@emmag_model'
        },
        status: 'approved'
      }
    ];

    setModels(dummyModels);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-16 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading models...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-16 flex items-center justify-center">
        <div className="text-2xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-16">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Models</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover our talented roster of professional models who bring creativity and excellence to every project.
        </p>
      </section>

      {/* Models Grid */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {models.map((model) => (
            <motion.div
              key={model._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedModel(model)}
            >
              <div className="aspect-[3/4] relative">
                <img
                  src={model.portfolio[0] || 'https://via.placeholder.com/400x600?text=No+Image'}
                  alt={`${model.firstName} ${model.lastName}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{`${model.firstName} ${model.lastName}`}</h3>
                <div className="flex items-center space-x-4 text-gray-600">
                  <span>{new Date().getFullYear() - new Date(model.dateOfBirth).getFullYear()} years</span>
                  <span>•</span>
                  <span>{model.height}cm</span>
                </div>
                <div className="mt-4">
                  <p className="text-gray-600 line-clamp-2">{model.experience}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Model Details Modal */}
      <AnimatePresence>
        {selectedModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedModel(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  onClick={() => setSelectedModel(null)}
                  className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="aspect-[16/9] relative">
                  <img
                    src={selectedModel.portfolio[0] || 'https://via.placeholder.com/1200x800?text=No+Image'}
                    alt={`${selectedModel.firstName} ${selectedModel.lastName}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {`${selectedModel.firstName} ${selectedModel.lastName}`}
                </h2>
                <div className="flex items-center space-x-6 text-gray-600 mb-6">
                  <span>{new Date().getFullYear() - new Date(selectedModel.dateOfBirth).getFullYear()} years</span>
                  <span>•</span>
                  <span>{selectedModel.height}cm</span>
                </div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Experience</h3>
                  <p className="text-gray-600">{selectedModel.experience}</p>
                </div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Measurements</h3>
                  <div className="flex space-x-6 text-gray-600">
                    <span>Bust: {selectedModel.measurements.bust}</span>
                    <span>Waist: {selectedModel.measurements.waist}</span>
                    <span>Hips: {selectedModel.measurements.hips}</span>
                  </div>
                </div>
                {selectedModel.portfolio.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Portfolio</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedModel.portfolio.map((image, index) => (
                        <div key={index} className="aspect-[3/4] relative rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`Portfolio ${index + 1}`}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedModel.socialMedia && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Social Media</h3>
                    <div className="space-y-2">
                      {selectedModel.socialMedia.instagram && (
                        <a
                          href={`https://instagram.com/${selectedModel.socialMedia.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-600 hover:text-primary"
                        >
                          <span className="mr-2">Instagram:</span>
                          {selectedModel.socialMedia.instagram}
                        </a>
                      )}
                      {selectedModel.socialMedia.facebook && (
                        <a
                          href={`https://facebook.com/${selectedModel.socialMedia.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-600 hover:text-primary"
                        >
                          <span className="mr-2">Facebook:</span>
                          {selectedModel.socialMedia.facebook}
                        </a>
                      )}
                      {selectedModel.socialMedia.twitter && (
                        <a
                          href={`https://twitter.com/${selectedModel.socialMedia.twitter.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-600 hover:text-primary"
                        >
                          <span className="mr-2">Twitter:</span>
                          {selectedModel.socialMedia.twitter}
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Models; 