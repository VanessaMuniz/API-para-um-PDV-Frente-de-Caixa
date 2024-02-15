create table usuarios (
  id serial primary key, 
  nome VARCHAR(255) not null,
  email VARCHAR(255) UNIQUE not null, 
  senha VARCHAR(255) not null
);

create table categorias (
	id serial primary key,
  descricao VARCHAR(255) NOT NULL
);

insert into categorias (descricao) values 
('Informática'),
('Celulares'),
('Beleza e Perfumaria'),
('Mercado'),
('Livros e Papelaria'),
('Brinquedos'),
('Moda'),
('Bebê'),
('Games');

create table produtos (
 id serial primary key,
 descricao VARCHAR(255) NOT NULL,
 quantidade_estoque VARCHAR(255) NOT NULL,
 valor decimal(10,2) NOT NULL,
 categoria_id INT REFERENCES categorias(id),
 produto_imagem VARCHAR(255)
 );

 create table clientes (
 id serial primary key,
 nome VARCHAR(255) NOT NULL,
 email VARCHAR(255) unique NOT NULL,
 cpf VARCHAR(11) unique NOT NULL,
 );

 create table pedidos (
	id serial primary key,
  cliente_id INT REFERENCES clientes(id),
  observacao VARCHAR(255), 
  produto_id INT REFERENCES produtos(id),
  valor_total decimal(10,2) NOT NULL
);

create table pedido_produtos (
	id serial primary key,
  pedido_id INT REFERENCES pedidos(id),
  produto_id INT REFERENCES produtos(id),
  quantidade_produto INT NOT NULL,
  valor_produto decimal(10,2) NOT NULL
);