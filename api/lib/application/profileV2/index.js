const ProfileV2Controller = require('./profileV2-controller');
exports.register = async function(server) {
  server.route([
    {
      method: 'GET',
      path: '/api/profileV2/{id}',
      config: {
        handler: ProfileV2Controller.get,
        tags: ['api'],
        notes: [
          '- **Route nécessitant une authentification**\n' +
          '- Cette route renvoie les éléments nécessaire à la construction du profil V2'
        ]
      }
    }
  ]);
};

exports.name = 'profileV2-api';
