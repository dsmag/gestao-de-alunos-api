import { api } from '../helpers/api.js'
import { expect } from "chai";
import { comTokenDeAdmin, getToken } from '../helpers/auth.js'
import { novoAluno } from '../factories/alunosFactory.js';
import { novaDisciplina } from '../factories/disciplinasFactory.js';
import entregaDeTrabalhos from '../fixtures/trabalhos.json' with { type: 'json' };

// Automação de Testes na Camada de Serviço (API): Trabalho de conclusão
describe('Fluxo de Entrega de trabalho como Aluno', () => {
    let adminToken;
    let aluno;

    before(async () => {
        // Token Admin
        adminToken = await comTokenDeAdmin();

        // Criação de Aluno
        aluno = novoAluno();
    });

    it('Validar que um aluno que acaba de ser cadastrado e matriculado em uma disciplina, consegue logar e entregar trabalhos', async () => {
        // Arrange (Given/Dado que/Preparar)
        // Cadastrar Aluno
        const cadastroAlunoResposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', adminToken)
            .send(aluno);

        const alunoId = cadastroAlunoResposta.body.id;

        // Cadastrar Disciplina
        const cadastroDisciplinaResposta = await api()
            .post('/api/admin/disciplinas')
            .set('Content-Type', 'application/json')
            .set('Authorization', adminToken)
            .send(novaDisciplina());

        const disciplinaId = cadastroDisciplinaResposta.body.id;

        // Matricular o aluno na disciplina cadastrada
        const cadastroMatriculaResposta = await api()
            .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
            .set('Content-Type', 'application/json')
            .set('Authorization', adminToken)
            .send({
                alunoId: alunoId
            });

        // Act (When/Quando/Agir/Executar)
        //  Logar com Aluno
        const alunoToken = await getToken(aluno.email, aluno.senha);
        //console.log('alunoToken - login: ' + alunoToken)

        // Entregar trabalho
        for (const trabalho of entregaDeTrabalhos.trabalhos) {

            const entregaTrabalhoResposta = await api()
                .post(`/api/alunos/${alunoId}/trabalhos`)
                .set('Authorization', `Bearer ${alunoToken}`)
                .send({
                    disciplinaId: disciplinaId,
                    titulo: trabalho.titulo,
                    descricao: trabalho.descricao
                });

            // console.log('entregaTrabalhoResposta - status: ' + entregaTrabalhoResposta.status);
            // console.log('entregaTrabalhoResposta - body:', entregaTrabalhoResposta.body);

            // Assert (Then/Então/Validar)
            // Validar entrega do trabalho
            expect(entregaTrabalhoResposta.status).to.equal(201);
            expect(entregaTrabalhoResposta.body.alunoId).to.equal(alunoId);
            expect(entregaTrabalhoResposta.body.disciplinaId).to.equal(disciplinaId);
            expect(entregaTrabalhoResposta.body.titulo).to.equal(trabalho.titulo);
            expect(entregaTrabalhoResposta.body.descricao).to.equal(trabalho.descricao);
            expect(entregaTrabalhoResposta.body.status).to.equal('entregue');
        }
    });
})