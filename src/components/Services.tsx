import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Navigation } from 'swiper/modules';
import Typography from './ui/Typography';
import CardButton from './ui/CardButton';

const services = [
  {
    id: 1,
    title: 'Distribuição de Alimentação',
    description:
      'Apoio com alimentos para pessoas em situação de rua, promovendo o bem-estar e dignidade.',
    image: '/img/servico.jpg',
  },
  {
    id: 2,
    title: 'Atendimento Psicológico',
    description:
      'Apoio psicológico para pessoas em situação de risco, oferecendo suporte emocional e orientação.',
    image: '/img/servico.jpg',
  },
  {
    id: 3,
    title: 'Apoio Jurídico',
    description:
      'Assistência jurídica gratuita para resolução de questões legais, garantindo direitos essenciais.',
    image: '/img/servico.jpg',
  },
  {
    id: 4,
    title: 'Oficinas de Empoderamento',
    description:
      'Oficinas educativas e de capacitação para promover a autonomia e reintegração social.',
    image: '/img/servico.jpg',
  },
];

export default function Services() {
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
              <div className="bg-white border rounded-lg shadow-md overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <Typography variant="h3" className="text-lg text-gray-900">
                    {service.title}
                  </Typography>
                  <Typography
                    variant="p"
                    className="text-sm text-gray-600 mt-2"
                  >
                    {service.description}
                  </Typography>
                  <CardButton>Saiba Mais</CardButton>
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
