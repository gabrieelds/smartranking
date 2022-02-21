import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarAtualizarJogadorDTO } from './dto/criar-atualizar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {
    private jogadores: Jogador[] = []

    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>) {}

    private readonly logger = new Logger(JogadoresService.name)

    async criarAtualizarJogador(criarAtualizarJogador: CriarAtualizarJogadorDTO): Promise<void>{
        this.logger.log(`criarAtualizarJogador: ${criarAtualizarJogador}`)
        
        const { email } = criarAtualizarJogador

        const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec()
        
        jogadorEncontrado ? this.atualizar(jogadorEncontrado, criarAtualizarJogador) : this.criar(criarAtualizarJogador)
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {
        return await this.jogadorModel.find().exec()
    }

    async consultarJogadorPorEmail(email: string): Promise<Jogador> {
        const jogador = this.jogadorModel.findOne({email}).exec()
        if (!jogador)
            throw new NotFoundException('e-mail não encontrado')
        
        return jogador
    }

    async deletarJogador(email): Promise<any> {
        try{
            return await this.jogadorModel.remove({email}).exec()
        } catch(error) {
            throw new NotFoundException('e-mail não encontrado')
        } 
    }

    private async criar(criarJogador: CriarAtualizarJogadorDTO): Promise<Jogador> {
        const jogadorCriado = new this.jogadorModel(CriarAtualizarJogadorDTO)
        return jogadorCriado.save()        
    }

    private async atualizar(jogador: Jogador, atualizarJogador: CriarAtualizarJogadorDTO): Promise<Jogador> {
        return this.jogadorModel.findOneAndUpdate({ email: jogador.email }, { $set: atualizarJogador }).exec()
    }
}
