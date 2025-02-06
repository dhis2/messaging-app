const config = {
    type: 'app',
    coreApp: true,
    title: 'Messaging',
    id: '335eff74-24b5-48db-a5f6-1f488d7847c3',
    minDHIS2Version: '2.29',
    name: 'messaging',
    description: 'An application for sending internal messages',
    entryPoints: {
        app: './src/components/App/AppWrapper.jsx',
    },
}

module.exports = config
