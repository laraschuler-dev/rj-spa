import { useState, useEffect } from 'react';
import { HomeService } from '../services/homeService';
import type { HomeEventDTO, HomeServiceDTO } from '../types/home';

interface UseHomeEventsReturn {
  events: HomeEventDTO[];
  loading: boolean;
  error: string | null;
}

interface UseHomeServicesReturn {
  services: HomeServiceDTO[];
  loading: boolean;
  error: string | null;
}

export function useHomeEvents(limit: number = 6): UseHomeEventsReturn {
  const [events, setEvents] = useState<HomeEventDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const eventsData = await HomeService.getHomeEvents(limit);
        setEvents(eventsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erro ao carregar eventos'
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [limit]);

  return { events, loading, error };
}

export function useHomeServices(limit: number = 6): UseHomeServicesReturn {
  const [services, setServices] = useState<HomeServiceDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const servicesData = await HomeService.getHomeServices(limit);
        setServices(servicesData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erro ao carregar serviços'
        );
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [limit]);

  return { services, loading, error };
}
