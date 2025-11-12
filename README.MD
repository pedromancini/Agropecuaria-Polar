Pacotes necessários para rodar!
npm install express bcryptjs ejs nodemon sequelize mysql2 express-session multer


exec migrations : 
npx sequelize-cli db:migrate

seeder para horarios padrões:  
npx sequelize-cli db:seed:all

alterar os horarios: 
limpar horarios antigos: 
npx sequelize-cli db:seed:undo

add novo seeder: 
npx sequelize-cli db:seed:all


use agropec_polar;

SELECT * FROM agropec_polar.usuarios;
SELECT * FROM agropec_polar.enderecos;
SELECT * FROM agropec_polar.pets;
SELECT * FROM agropec_polar.horarios;
SELECT * FROM agropec_polar.agendamentos;


---- DROP TABLE ----


use agropec_polar;



drop table servicoProdutos;
drop table produtos;
drop table servicos;
drop table pets;
drop table usuarios;
drop table enderecos;
drop table agendamentos;
drop table enderecos;
drop table horarios;
drop table pets;
drop table sequelizemeta;
drop table usuarios;


---- set adm --
UPDATE USUARIOS
SET TipoUsuario = 'Admin'
WHERE Email = 'email@gmail.com';