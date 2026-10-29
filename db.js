import mariadb from 'mariadb';

function conexaoBanco() {
    const conB = mariadb.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });
    return conB;
}

export default conexaoBanco;