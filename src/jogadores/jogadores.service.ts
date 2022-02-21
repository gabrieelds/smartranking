import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarAtualizarJogadorDTO } from './dto/criar-atualizar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JogadoresService {
    private jogadores: Jogador[] = []
    private readonly logger = new Logger(JogadoresService.name)

    async criarAtualizarJogador(criarAtualizarJogador: CriarAtualizarJogadorDTO): Promise<void>{
        this.logger.log(`criarAtualizarJogador: ${criarAtualizarJogador}`)
        
        const { email } = criarAtualizarJogador

        const jogadorEncontrado = await this.jogadores.find(jogador => jogador.email === email)
        
        jogadorEncontrado ? this.atualizar(jogadorEncontrado, criarAtualizarJogador) : this.criar(criarAtualizarJogador)
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {
        return this.jogadores
    }

    async consultarJogadorPorEmail(email: string): Promise<Jogador> {
        const jogador = this.jogadores.find(jog => jog.email === email)
        if (!jogador)
            throw new NotFoundException('e-mail não encontrado')
        
        return jogador
    }

    async deletarJogador(email): Promise<void> {
        try{
            this.jogadores = this.jogadores.filter(function(jogador, index, arr){
                return jogador.email !== email
            })
        } catch(error) {
            throw new NotFoundException('e-mail não encontrado')
        } 
    }

    private criar(criarJogador: CriarAtualizarJogadorDTO): void {
        const { nome, telefone, email } = criarJogador
        const jogador: Jogador = {
            _id: uuidv4(),
            nome,
            telefone,
            email,
            ranking: 'A',
            posicaoRanking: 1,
            urlFoto: 'www.teste.com/foto/123.jpg'
        }

        this.jogadores.push(jogador)
    }

    private atualizar(jogador: Jogador, atualizarJogador: CriarAtualizarJogadorDTO): void {
        const { nome, urlFoto } = atualizarJogador
        jogador.nome = nome
        jogador.urlFoto = urlFoto
    }
}
