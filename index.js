// Zapier App Definition for BlackRoad
module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: {
    type: 'custom',
    fields: [
      {
        key: 'apiKey',
        label: 'API Key',
        required: true,
        type: 'string',
        helpText: 'Get your API key from https://blackroad.io/settings/api-keys'
      }
    ],
    test: {
      url: 'https://api.blackroad.io/v1/auth/verify',
      method: 'GET',
      headers: {
        'Authorization': 'Bearer {{bundle.authData.apiKey}}'
      }
    }
  },

  triggers: {
    deployment_created: {
      key: 'deployment_created',
      noun: 'Deployment',
      display: {
        label: 'New Deployment',
        description: 'Triggers when a new deployment is created.',
        important: true
      },
      operation: {
        perform: {
          url: 'https://api.blackroad.io/v1/deployments',
          method: 'GET',
          headers: {
            'Authorization': 'Bearer {{bundle.authData.apiKey}}'
          }
        }
      }
    },
    deployment_completed: {
      key: 'deployment_completed',
      noun: 'Deployment',
      display: {
        label: 'Deployment Completed',
        description: 'Triggers when a deployment completes.'
      },
      operation: {
        perform: {
          url: 'https://api.blackroad.io/v1/deployments?status=completed',
          method: 'GET',
          headers: {
            'Authorization': 'Bearer {{bundle.authData.apiKey}}'
          }
        }
      }
    },
    analytics_threshold: {
      key: 'analytics_threshold',
      noun: 'Analytics',
      display: {
        label: 'Analytics Threshold Reached',
        description: 'Triggers when analytics reach a threshold.'
      },
      operation: {
        perform: {
          url: 'https://api.blackroad.io/v1/analytics/alerts',
          method: 'GET',
          headers: {
            'Authorization': 'Bearer {{bundle.authData.apiKey}}'
          }
        }
      }
    }
  },

  creates: {
    create_deployment: {
      key: 'create_deployment',
      noun: 'Deployment',
      display: {
        label: 'Create Deployment',
        description: 'Creates a new deployment on BlackRoad.'
      },
      operation: {
        perform: {
          url: 'https://api.blackroad.io/v1/deployments',
          method: 'POST',
          headers: {
            'Authorization': 'Bearer {{bundle.authData.apiKey}}',
            'Content-Type': 'application/json'
          },
          body: {
            name: '{{bundle.inputData.name}}',
            source: '{{bundle.inputData.source}}',
            environment: '{{bundle.inputData.environment}}'
          }
        },
        inputFields: [
          {
            key: 'name',
            label: 'App Name',
            type: 'string',
            required: true,
            helpText: 'Name for your deployment'
          },
          {
            key: 'source',
            label: 'Source',
            type: 'string',
            required: false,
            helpText: 'GitHub repo or other source'
          },
          {
            key: 'environment',
            label: 'Environment',
            type: 'string',
            choices: ['production', 'staging', 'development'],
            default: 'production'
          }
        ]
      }
    },
    track_event: {
      key: 'track_event',
      noun: 'Event',
      display: {
        label: 'Track Event',
        description: 'Track an analytics event.'
      },
      operation: {
        perform: {
          url: 'https://api.blackroad.io/v1/analytics/events',
          method: 'POST',
          headers: {
            'Authorization': 'Bearer {{bundle.authData.apiKey}}',
            'Content-Type': 'application/json'
          },
          body: {
            event: '{{bundle.inputData.event}}',
            properties: '{{bundle.inputData.properties}}'
          }
        },
        inputFields: [
          {
            key: 'event',
            label: 'Event Name',
            type: 'string',
            required: true
          },
          {
            key: 'properties',
            label: 'Properties (JSON)',
            type: 'text',
            required: false
          }
        ]
      }
    }
  },

  searches: {
    find_deployment: {
      key: 'find_deployment',
      noun: 'Deployment',
      display: {
        label: 'Find Deployment',
        description: 'Finds a deployment by ID or name.'
      },
      operation: {
        perform: {
          url: 'https://api.blackroad.io/v1/deployments/{{bundle.inputData.id}}',
          method: 'GET',
          headers: {
            'Authorization': 'Bearer {{bundle.authData.apiKey}}'
          }
        },
        inputFields: [
          {
            key: 'id',
            label: 'Deployment ID',
            type: 'string',
            required: true
          }
        ]
      }
    }
  }
}
