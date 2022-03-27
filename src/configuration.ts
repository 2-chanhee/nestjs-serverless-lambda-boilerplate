export default () => ({
    stage: process.env.stage || 'dev', // deploy 환경
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
                  type: 'mysql',
                  port: 3306,
                  autoLoadEntities: true,
                  synchronize: false,
                  bigNumberStrings: false,
                  // for postgresql
                  extra: {
                      ssl: {
                          rejectUnauthorized: false
                      }
                  }
              }
});
