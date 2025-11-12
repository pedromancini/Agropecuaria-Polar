Pacotes necessários para rodar!
npm install express bcryptjs ejs nodemon sequelize mysql2 express-session multer


exec migrations : 
npx sequelize-cli db:migrate

seeder para horarios padrões:  
npx sequelize-cli db:seed:all