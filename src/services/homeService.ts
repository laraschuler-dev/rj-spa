import api from './api';
import type { HomeEventDTO, HomeServiceDTO } from '../types/home';

export class HomeService {
  static async getHomeEvents(limit: number = 6): Promise<HomeEventDTO[]> {
    try {
      const response = await api.get(`/home/events?limit=${limit}`);
      return response.data.events;
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      throw new Error('Não foi possível carregar os eventos');
    }
  }

  static async getHomeServices(limit: number = 6): Promise<HomeServiceDTO[]> {
    try {
      const response = await api.get(`/home/services?limit=${limit}`);
      return response.data.services;
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      throw new Error('Não foi possível carregar os serviços');
    }
  }
}
