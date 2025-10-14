import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Navigation } from 'swiper/modules';
import Typography from './ui/Typography';
import CardButton from './ui/CardButton';
import { useHomeServices } from '../hooks/useHomeData';
import { resolveImageUrl } from '../utils/resolveImageUrl';

export default function Services() {
  const { services, loading, error } = useHomeServices(6);

  if (loading) {
    return (
      <section
        id="services"
        className="w-full py-12 px-4 md:px-8 bg-gray-50 mb-6"
      >
        <div className="max-w-3xl mx-auto text-center">
          <Typography
            variant="h1"
            className="text-3xl md:text-5xl font-bold text-primary"
          >
            Serviços Disponíveis
          </Typography>
          <Typography variant="p" className="text-gray-600 mt-2">
            Carregando serviços...
          </Typography>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="services"
        className="w-full py-12 px-4 md:px-8 bg-gray-50 mb-6"
      >
        <div className="max-w-3xl mx-auto text-center">
          <Typography
            variant="h1"
            className="text-3xl md:text-5xl font-bold text-primary"
          >
            Serviços Disponíveis
          </Typography>
          <Typography variant="p" className="text-red-600 mt-2">
            {error}
          </Typography>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section
        id="services"
        className="w-full py-12 px-4 md:px-8 bg-gray-50 mb-6"
      >
        <div className="max-w-3xl mx-auto text-center">
          <Typography
            variant="h1"
            className="text-3xl md:text-5xl font-bold text-primary"
          >
            Serviços Disponíveis
          </Typography>
          <Typography variant="p" className="text-gray-600 mt-2">
            Nenhum serviço disponível no momento.
          </Typography>
        </div>
      </section>
    );
  }

  return (
    <section
      id="services"
      className="w-full py-12 px-4 md:px-8 bg-gray-50 mb-6"
    >
      <div className="max-w-3xl mx-auto text-center">
        <Typography
          variant="h1"
          className="text-3xl md:text-5xl font-bold text-primary"
        >
          Serviços Disponíveis
        </Typography>
        <Typography variant="p" className="text-gray-600 mt-2">
          Conheça os serviços oferecidos pela nossa rede social solidária,
          desenvolvidos para apoiar e transformar vidas.
        </Typography>
      </div>

      <div className="mt-8 max-w-4xl mx-auto relative">
        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={16}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {services.map((service) => (
            <SwiperSlide key={service.id}>
              <div className="bg-white border rounded-lg shadow-md overflow-hidden flex flex-col h-full">
                {/* Container da imagem com altura fixa mas proporção preservada */}
                <div className="w-full h-40 flex-shrink-0 overflow-hidden">
                  <img
                    src={
                      resolveImageUrl(service.image) ||
                      '/img/servico-solidario.png'
                    }
                    alt={service.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/img/servico-solidario.png';
                    }}
                  />
                </div>

                {/* Resto do conteúdo permanece igual */}
                <div className="p-3 flex flex-col flex-1">
                  <div className="h-10 mb-1">
                    <Typography
                      variant="h3"
                      className="text-base text-gray-900 line-clamp-2"
                    >
                      {service.title}
                    </Typography>
                  </div>

                  <div className="h-20 mb-2 flex-1">
                    <Typography
                      variant="p"
                      className="text-sm text-gray-600 line-clamp-3"
                    >
                      {service.description}
                    </Typography>
                  </div>

                  <div className="mt-2">
                    <CardButton>Saiba Mais</CardButton>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Botões de navegação - posicionados fora do card */}
        <div className="swiper-button-prev text-3xl absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-blue-600"></div>
        <div className="swiper-button-next text-3xl absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-blue-600"></div>
      </div>
    </section>
  );
}
