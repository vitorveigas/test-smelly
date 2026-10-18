const { UserService } = require('../src/userService');

describe('UserService', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  describe('createUser', () => {
    test('deve atribuir um id ao usuário criado', () => {
      // Arrange
      const nome = 'Fulano de Tal';
      const email = 'fulano@teste.com';
      const idade = 25;

      // Act
      const usuarioCriado = userService.createUser(nome, email, idade);

      // Assert
      expect(usuarioCriado.id).toBeDefined();
    });

    test('deve lançar erro ao criar usuário menor de idade', () => {
      // Arrange
      const idadeMenor = 17;

      // Act
      const criarMenorDeIdade = () =>
        userService.createUser('Menor', 'menor@email.com', idadeMenor);

      // Assert
      expect(criarMenorDeIdade).toThrow('O usuário deve ser maior de idade.');
    });
  });

  describe('getUserById', () => {
    test('deve retornar o usuário criado com o mesmo nome', () => {
      // Arrange
      const usuarioCriado = userService.createUser('Fulano de Tal', 'fulano@teste.com', 25);

      // Act
      const usuarioBuscado = userService.getUserById(usuarioCriado.id);

      // Assert
      expect(usuarioBuscado.nome).toBe('Fulano de Tal');
    });

    test('deve retornar o usuário recém-criado com status ativo', () => {
      // Arrange
      const usuarioCriado = userService.createUser('Fulano de Tal', 'fulano@teste.com', 25);

      // Act
      const usuarioBuscado = userService.getUserById(usuarioCriado.id);

      // Assert
      expect(usuarioBuscado.status).toBe('ativo');
    });
  });

  describe('deactivateUser', () => {
    test('deve retornar true ao desativar um usuário comum', () => {
      // Arrange
      const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

      // Act
      const resultado = userService.deactivateUser(usuarioComum.id);

      // Assert
      expect(resultado).toBe(true);
    });

    test('deve alterar o status para inativo ao desativar um usuário comum', () => {
      // Arrange
      const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

      // Act
      userService.deactivateUser(usuarioComum.id);
      const usuarioAtualizado = userService.getUserById(usuarioComum.id);

      // Assert
      expect(usuarioAtualizado.status).toBe('inativo');
    });

    test('deve retornar false ao tentar desativar um administrador', () => {
      // Arrange
      const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

      // Act
      const resultado = userService.deactivateUser(usuarioAdmin.id);

      // Assert
      expect(resultado).toBe(false);
    });

    test('deve manter o status ativo de um administrador após tentativa de desativação', () => {
      // Arrange
      const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

      // Act
      userService.deactivateUser(usuarioAdmin.id);
      const usuarioAtualizado = userService.getUserById(usuarioAdmin.id);

      // Assert
      expect(usuarioAtualizado.status).toBe('ativo');
    });
  });

  describe('generateUserReport', () => {
    test('deve iniciar o relatório com o título', () => {
      // Arrange
      userService.createUser('Alice', 'alice@email.com', 28);

      // Act
      const relatorio = userService.generateUserReport();

      // Assert
      expect(relatorio).toMatch(/^--- Relatório de Usuários ---/);
    });

    test('deve incluir o nome de todos os usuários cadastrados no relatório', () => {
      // Arrange
      userService.createUser('Alice', 'alice@email.com', 28);
      userService.createUser('Bob', 'bob@email.com', 32);

      // Act
      const relatorio = userService.generateUserReport();

      // Assert
      expect(relatorio).toContain('Alice');
      expect(relatorio).toContain('Bob');
    });

    test('não deve listar nenhum usuário no relatório quando não há usuários', () => {
      // Arrange
      // (banco limpo pelo beforeEach)

      // Act
      const relatorio = userService.generateUserReport();

      // Assert
      expect(relatorio).not.toContain('ID:');
    });
  });
});