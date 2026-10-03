import  request from 'supertest';
import { expect } from "chai";
import { getToken } from '../helpers/auth.js';

describe('Login', () => {
    // Obter o token
    let token;

    beforeEach(async () => {
        token = await getToken('admin@escola.com', 'admin123')
    });
    
    
    it('deve cadastrar um aluno quando ele informa dados válidos', async () => {
        // Cadastrar o aluno
        const cadastroAlunoResposta = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({ 
                nome: 'Camila Pitanga',
                email: 'camila.pitanga@example.com',
                matricula: '2026-1117',
                senha: '123456'
            });

        // Validar aluno cadastrado
        console.log('dados do aluno cadastrado: ' + cadastroAlunoResposta.body)
        expect(cadastroAlunoResposta.status).to.equal(201);
        expect(cadastroAlunoResposta.body.nome).to.equal('Camila Pitanga');
        expect(cadastroAlunoResposta.body.email).to.equal('camila.pitanga@example.com');
        expect(cadastroAlunoResposta.body.matricula).to.equal('2026-1117');
    });

    it('deve negar o cadastro de um aluno quando ele já existe', async () => {
        // Cadastrar o aluno
        const cadastroAlunoResposta = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({ 
                nome: 'Ana Souza',
                email: 'ana.souza@example.com',
                matricula: '2024001',
                senha: '123456'
            });

        // Validar aluno cadastrado
        expect(cadastroAlunoResposta.status).to.equal(409);
        expect(cadastroAlunoResposta.body.error).to.equal('Já existe um aluno cadastrado com essa matrícula ou e-mail.');
    });
});
