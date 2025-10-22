import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Navigation } from 'swiper/modules';
import Typography from './ui/Typography';
import CardButton from './ui/CardButton';
import { useHomeEvents } from '../hooks/useHomeData';
import { resolveImageUrl } from '../utils/resolveImageUrl';
import formatDateBR from '../utils/formatDateBR';

export default function Eventos() {
  const { events, loading, error } = useHomeEvents(6);

  if (loading) {
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
            Carregando eventos...
          </Typography>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="events" className="w-full py-12 px-4 md:px-8 bg-white mb-6">
        <div className="max-w-3xl mx-auto text-center">
          <Typography
            variant="h1"
            className="text-3xl md:text-5xl font-bold text-primary"
          >
            Eventos
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
      <section id="events" className="w-full py-12 px-4 md:px-8 bg-white mb-6">
        <div className="max-w-3xl mx-auto text-center">
          <Typography
            variant="h1"
            className="text-3xl md:text-5xl font-bold text-primary"
          >
            Eventos
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
                {/* Imagem - mais compacta */}
                <img
                  src={
                    resolveImageUrl(event.image) || '/img/evento-solidario.png'
                  }
                  alt={event.title}
                  className="w-full h-40 object-cover flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = '/img/evento-solidario.png';
                  }}
                />

                {/* Conteúdo - mais compacto */}
                <div className="p-3 flex flex-col flex-1">
                  {/* Título - mais compacto */}
                  <div className="h-10 mb-1">
                    <Typography
                      variant="h3"
                      className="text-base text-gray-900 line-clamp-2"
                    >
                      {event.title}
                    </Typography>
                  </div>

                  {/* Informações - mais compacto */}
                  <div className="h-14 mb-2">
                    <Typography
                      variant="p"
                      className="text-sm text-gray-600 space-y-1"
                    >
                      <div>
                        <strong>Data:</strong> {formatDateBR(event.date)}
                      </div>
                      <div className="flex">
                        <strong className="flex-shrink-0">Local:</strong>
                        <span className="line-clamp-2 ml-1">
                          {event.location}
                        </span>
                      </div>
                    </Typography>
                  </div>
                  {/* Botão - mais compacto */}
                  <div className="mt-2">
                    <CardButton>Saiba Mais</CardButton>
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
