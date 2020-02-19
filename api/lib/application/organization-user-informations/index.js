const Joi = require('@hapi/joi');
const organizationUserInformationsController = require('./organization-user-informations-controller');

exports.register = async function(server) {
  server.route([
    {
      method: 'POST',
      path: '/api/organization-user-informations',
      config: {
        handler: organizationUserInformationsController.create,
        validate: {
          options: {
            allowUnknown: true
          },
          payload: Joi.object({
            data: {
              relationships: {
                organization: {
                  data: {
                    id: Joi.number().required(),
                  }
                },
                user: {
                  data: {
                    id: Joi.number().required()
                  }
                }
              }
            }
          })
        },
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
          '- Création ds informations utilisateurs liées à Pix Orga\n' +
          '- L’id dans le payload doit correspondre à celui de l’utilisateur authentifié',
        ],
        tags: ['api', 'organization-user-informations']
      }

    },
    {
      method: 'PATCH',
      path: '/api/organization-user-informations',
      config: {
        handler: organizationUserInformationsController.update,
        validate: {
          options: {
            allowUnknown: true
          },
          payload: Joi.object({
            data: {
              relationships: {
                organization: {
                  data: {
                    id: Joi.number().required(),
                  }
                },
                user: {
                  data: {
                    id: Joi.number().required()
                  }
                }
              }
            }
          })
        },
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
          '- Mise à jour des informations utilisateurs liées à Pix Orga\n' +
          '- L’id dans le payload doit correspondre à celui de l’utilisateur authentifié',
        ],
        tags: ['api', 'organization-user-informations']
      }
    }
  ]);
};

exports.name = 'organization-user-informations-api';
