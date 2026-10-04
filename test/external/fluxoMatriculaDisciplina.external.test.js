import { api } from '../helpers/api.js'
import { expect } from "chai";
import { comTokenDeAdmin } from '../helpers/auth.js'
import { novoAluno } from '../factories/alunosFactory.js';
import { novaDisciplina } from '../factories/disciplinasFactory.js';
import testeDeMatriculas from '../fixtures/matriculas.json' with { type: 'json' };

describe('Matrícula de aluno em disciplina', () => {
    it('Validar que um aluno que acaba de ser cadastrado pode ser matriculado em uma nova disciplina', async () => {
        // Arrange (Given/Dado que/Preparar)
        // Cadastrar o aluno, fazer login e cadastrar a disciplina
        
        const cadastroAlunoResposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send(novoAluno());

        const alunoId = cadastroAlunoResposta.body.id;

        const cadastroDisciplinaResposta = await api()
            .post('/api/admin/disciplinas')
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send(novaDisciplina());

        const disciplinaId = cadastroDisciplinaResposta.body.id;

        // Act (When/Quando/Agir/Executar)
        // Matricular o aluno
        const cadastroMatriculaResposta = await api()
            .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send({ 
                alunoId: alunoId
            });

        // Assert (Then/Então/Validar)
        // Validar que o aluno de fato foi matriculado na disciplina
        expect(cadastroMatriculaResposta.status).to.equal(201);
        expect(cadastroMatriculaResposta.body.alunoId).to.equal(alunoId);
        expect(cadastroMatriculaResposta.body.disciplinaId).to.equal(disciplinaId);
    })

    testeDeMatriculas.forEach(testeDeMatricula => {
        it(testeDeMatricula.testTitle, async () => {
            // Arrange (Given/Dado que/Preparar)
            // Cadastrar o aluno, fazer login e cadastrar a disciplina
            
            const cadastroAlunoResposta = await api()
                .post('/api/admin/alunos')
                .set('Content-Type', 'application/json')
                .set('Authorization', await comTokenDeAdmin())
                .send(testeDeMatricula.dadosAluno);

            const alunoId = cadastroAlunoResposta.body.id;

            const cadastroDisciplinaResposta = await api()
                .post('/api/admin/disciplinas')
                .set('Content-Type', 'application/json')
                .set('Authorization', await comTokenDeAdmin())
                .send(testeDeMatricula.dadosDisciplina);

            const disciplinaId = cadastroDisciplinaResposta.body.id;

            // Act (When/Quando/Agir/Executar)
            // Matricular o aluno
            const cadastroMatriculaResposta = await api()
                .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
                .set('Content-Type', 'application/json')
                .set('Authorization', await comTokenDeAdmin())
                .send({ 
                    alunoId: alunoId
                });

            // Assert (Then/Então/Validar)
            // Validar que o aluno de fato foi matriculado na disciplina
            expect(cadastroMatriculaResposta.status).to.equal(testeDeMatricula.statusCodeEsperdo);
            //expect(cadastroMatriculaResposta.body.alunoId).to.equal(alunoId);
            //expect(cadastroMatriculaResposta.body.disciplinaId).to.equal(disciplinaId);
        })
    });
})