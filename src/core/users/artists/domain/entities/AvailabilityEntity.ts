import { Type } from 'class-transformer';
import { AddressInfoEntity } from '@/core/addresses/entities/AddressInfoEntity';

export class AvailabilityEntity {
  id?: string;
  dataInicio: Date;
  dataFim: Date;
  horarioInicio: string;
  horarioFim: string;
  diasDaSemana: string[];
  valorShow: number;
  
  @Type(() => AddressInfoEntity)
  endereco: AddressInfoEntity;

  raioAtuacao: number;
  repetir: boolean;

  constructor(init: {
    id?: string;
    dataInicio: Date;
    dataFim: Date;
    horarioInicio: string;
    horarioFim: string;
    diasDaSemana: string[];
    valorShow: number;
    endereco: AddressInfoEntity;
    raioAtuacao: number;
    repetir: boolean;
  }) {
    this.id = init.id;
    this.dataInicio = init.dataInicio;
    this.dataFim = init.dataFim;
    this.horarioInicio = init.horarioInicio;
    this.horarioFim = init.horarioFim;
    this.diasDaSemana = init.diasDaSemana;
    this.valorShow = init.valorShow;
    this.endereco = init.endereco;
    this.raioAtuacao = init.raioAtuacao;
    this.repetir = init.repetir;
  }

  static daysOfWeek(): string[] {
    return ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  }

  static daysOfWeekMap(): Record<string, string> {
    return {
      'Domingo': 'SU',
      'Segunda': 'MO',
      'Terça': 'TU',
      'Quarta': 'WE',
      'Quinta': 'TH',
      'Sexta': 'FR',
      'Sábado': 'SA',
    };
  }

  static daysOfWeekList(): string[] {
    return ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  }
} 