import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

const events = [
  {
    id: 1,
    title: 'Mutirão Solidário',
    date: '25 Fev, 14h',
    location: 'Centro Comunitário',
    image: '/img/psr_7.jpg',
  },
  {
    id: 2,
    title: 'Doação de Roupas',
    date: '10 Mar, 10h',
    location: 'Praça Central',
    image: '/img/psr_7.jpg',
  },
  {
    id: 3,
    title: 'Ação Alimentação',
    date: '15 Mar, 12h',
    location: 'Igreja Solidária',
    image: '/img/psr_7.jpg',
  },
];

export default function Eventos() {
  return (
    <section id="events" className="w-full py-12 px-4 md:px-8 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900">Eventos</h2>
        <p className="text-gray-600 mt-2">
          Participe e faça a diferença! Acompanhe nossos eventos e junte-se às
          ações que transformam vidas.
        </p>
      </div>

      <div className="mt-8 max-w-4xl mx-auto relative">
        <Swiper
          modules={[Pagination]}
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
          {events.map((event) => (
            <SwiperSlide key={event.id}>
              <div className="bg-white border rounded-lg shadow-md overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    <strong>Data:</strong> {event.date} <br />
                    <strong>Local:</strong> {event.location}
                  </p>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-base rounded-md hover:bg-blue-700 w-full">
                    Saiba Mais
                  </button>
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
