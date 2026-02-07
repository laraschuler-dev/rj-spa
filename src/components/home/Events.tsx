import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Navigation } from 'swiper/modules';
import Typography from '../ui/Typography';
import CardButton from '../ui/CardButton';
import { useHomeEvents } from '../../hooks/useHomeData';
import { resolveImageUrl } from '../../utils/resolveImageUrl';
import formatDateBR from '../../utils/formatDateBR';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { useScrollStore } from '../../stores/scrollStore';

export default function Eventos() {
  const { events, loading, error } = useHomeEvents(6);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {}
  );
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loadingButtons, setLoadingButtons] = useState<{
    [key: string]: boolean;
  }>({});

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const setScrollTarget = useScrollStore((s) => s.setScrollTarget);

  const handleEventClick = async (event: any) => {
    const postId = event.postId || event.id;
    const targetUrl = `/post/${postId}`;

    if (!isAuthenticated) {
      toast.info('Faça login para ver os detalhes do evento');
      navigate('/login', {
        state: {
          from: targetUrl,
        },
      });
      return;
    }

    setLoadingButtons((prev) => ({ ...prev, [event.id]: true }));

    try {
      setScrollTarget('events', window.scrollY);
      navigate(targetUrl);
    } catch (error) {
      console.error('Erro ao navegar:', error);
    } finally {
      setLoadingButtons((prev) => ({ ...prev, [event.id]: false }));
    }
  };

  if (loading) {
    return (
      <section
        id="events"
        className="w-full py-12 px-4 md:px-8 bg-gray-50 mb-6"
      >
        <div className="max-w-3xl mx-auto text-center">
          <Typography
            variant="h1"
            className="text-3xl md:text-5xl font-bold text-primary"
          >
            Eventos Disponíveis
          </Typography>
          <Typography variant="p" className="text-gray-600 mt-2">
            Carregando eventos...
          </Typography>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="events"
        className="w-full py-12 px-4 md:px-8 bg-gray-50 mb-6"
      >
        <div className="max-w-3xl mx-auto text-center">
          <Typography
            variant="h1"
            className="text-3xl md:text-5xl font-bold text-primary"
          >
            Eventos Disponíveis
          </Typography>
          <Typography variant="p" className="text-red-600 mt-2">
            {error}
          </Typography>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section
        id="events"
        className="w-full py-12 px-4 md:px-8 bg-gray-50 mb-6"
      >
        <div className="max-w-3xl mx-auto text-center">
          <Typography
            variant="h1"
            className="text-3xl md:text-5xl font-bold text-primary"
          >
            Eventos Disponíveis
          </Typography>
          <Typography variant="p" className="text-gray-600 mt-2">
            Nenhum evento disponível no momento.
          </Typography>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="w-full py-12 px-4 md:px-8 bg-white mb-6">
      <div className="max-w-3xl mx-auto text-center">
        <Typography
          variant="h1"
          className="text-3xl md:text-5xl font-bold text-primary"
        >
          Eventos
        </Typography>
        <Typography variant="p" className="text-gray-600 mt-2">
          Participe e faça a diferença! Acompanhe nossos eventos e junte-se às
          ações que transformam vidas.
        </Typography>
      </div>

      <div className="mt-8 max-w-4xl mx-auto relative">
        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={12}
          slidesPerView={1}
          centeredSlides={true}
          centeredSlidesBounds={true}
          pagination={{ clickable: true }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              centeredSlides: true,
              centeredSlidesBounds: true,
            },
            1024: {
              slidesPerView: 3,
              centeredSlides: false,
              centeredSlidesBounds: false,
            },
          }}
        >
          {events.map((event) => (
            <SwiperSlide key={event.id}>
              <div className="bg-white border rounded-lg shadow-md overflow-hidden flex flex-col h-full">
                <div
                  className={`w-full aspect-[4/3] flex items-center justify-center rounded-t-lg overflow-hidden ${
                    !event.image || imageErrors[String(event.id)]
                      ? 'bg-[#f0f9ff]'
                      : 'bg-gradient-to-b from-gray-50 to-gray-100'
                  }`}
                >
                  <img
                    src={
                      event.image && !imageErrors[String(event.id)]
                        ? resolveImageUrl(event.image)
                        : '/img/evento-solidario.png'
                    }
                    alt={event.title}
                    className="object-contain w-full h-full transition-transform duration-300"
                    onError={() => handleImageError(String(event.id))}
                  />
                </div>

                {/* Conteúdo */}
                <div className="p-3 flex flex-col flex-1">
                  <div className="h-10 mb-1">
                    <Typography
                      variant="h3"
                      className="text-base text-gray-900 line-clamp-2"
                    >
                      {event.title}
                    </Typography>
                  </div>

                  <div className="h-14 mb-2">
                    <Typography
                      variant="p"
                      className="text-sm text-gray-600 space-y-1"
                    >
                      <span>
                        <strong>Data:</strong> {formatDateBR(event.date)}
                      </span>
                      <span className="flex">
                        <strong className="flex-shrink-0">Local:</strong>
                        <span className="line-clamp-2 ml-1">
                          {event.location}
                        </span>
                      </span>
                    </Typography>
                  </div>

                  <div className="mt-2">
                    <CardButton
                      onClick={() => handleEventClick(event)}
                      loading={loadingButtons[event.id]}
                      loadingText="Abrindo..."
                    >
                      Saiba Mais
                    </CardButton>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Botões de navegação */}
        <div className="swiper-button-prev text-3xl absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-blue-600"></div>
        <div className="swiper-button-next text-3xl absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-blue-600"></div>
      </div>
    </section>
  );
}
