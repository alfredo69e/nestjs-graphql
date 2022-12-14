export const EnvConfiguration = () => ({
    node_env: process.env.NODE_ENV || 'prod',
    port: +process.env.PORT || 3000,
    db_password: process.env.DB_PASSWORD ,
    db_name: process.env.DB_NAME ,
    db_host: process.env.DB_HOST ,
    db_port: process.env.DB_PORT ,
    db_username: process.env.DB_USERNAME,
    jwt_secret: process.env.JWT_SECRET,
    
});