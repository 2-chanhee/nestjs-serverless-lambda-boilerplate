export default () => ({
    database: {
        username: process.env.DATABASE_USERNAME || '',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_DATABASE || '',
        host: process.env.DATABASE_HOST || '',
        port: process.env.DATABASE_PORT || ''
    },
    stage: process.env.stage || 'dev',
    typeorm:
        process.env.NODE_ENV === 'test'
            ? {
                  type: 'sqlite',
                  database: ':memory:',
                  autoLoadEntities: true,
                  logging: process.env.NODE_ENV === 'test',
                  synchronize: true
              }
            : {
                  type: 'DATABASE',
                  autoLoadEntities: true,
                  synchronize: false,
                  bigNumberStrings: false,
                  ssl: {
                      rejectUnauthorized: false
                  }
              }
});
