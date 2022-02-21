import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CriarAtualizarJogadorDTO } from './dto/criar-atualizar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';

@Controller('api/v1/jogadores')
export class JogadoresController {

    constructor(private readonly jogadoresService: JogadoresService) {}

    @Post()
    async criarAtualizarJogador(@Body() criarAtualizarJogador: CriarAtualizarJogadorDTO) {
        await this.jogadoresService.criarAtualizarJogador(criarAtualizarJogador)
    }

    @Get()
    async consultarJogadores(
        @Query('email') email: string
    ): Promise<Jogador[] | Jogador> {
        if(email){
            return this.jogadoresService.consultarJogadorPorEmail(email)
        }
        return this.jogadoresService.consultarTodosJogadores()
    }

    @Delete()
    async deletarJogador(
        @Query('email') email: string
    ): Promise<void> {
        return this.jogadoresService.deletarJogador(email)
    }

}
