import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Typography from './ui/Typography';
import Button from './ui/Button';

const data = [
  { year: '2012', population: 104000 },
  { year: '2016', population: 160000 },
  { year: '2020', population: 220000 },
  { year: '2022', population: 281472 },
  { year: '2024', population: 327000 },
];

const Information = () => {
  return (
    <section
      id="information"
      className="py-12 px-6 md:px-12 lg:px-24 bg-gray-100 mb-6"
    >
      {/* Título e introdução */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <Typography
          variant="h1"
          className="text-3xl md:text-5xl font-bold text-primary"
        >
          A Realidade da População em Situação de Rua
        </Typography>

        <Typography variant="p" className="text-gray-700 mt-4">
          A população em situação de rua tem crescido exponencialmente nos
          últimos anos. Dados recentes revelam um cenário alarmante que exige
          soluções imediatas.
        </Typography>
      </motion.div>

      {/* Cards com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <Typography variant="h3" className="text-xl font-bold text-primary">
            Crescimento
          </Typography>
          <Typography variant="p" className="text-gray-700 mt-4">
            A população de rua aumentou 211% entre 2012 e 2022.
          </Typography>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <Typography variant="h3" className="text-xl font-bold text-primary">
            Perfil
          </Typography>
          <Typography variant="p" className="text-gray-700 mt-4">
            87% são homens, 68% são negros (UFMG, 2022).
          </Typography>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <Typography variant="h3" className="text-xl font-bold text-primary">
            Principais causas
          </Typography>
          <Typography variant="p" className="text-gray-700 mt-4">
            Desemprego, moradia precária, dependência química.
          </Typography>
        </motion.div>
      </div>

      {/* Gráfico */}
      <div className="mt-12">
        <Typography
          variant="h3"
          className="text-xl font-bold text-primary mb-2"
        >
          Evolução da População em Situação de Rua
        </Typography>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="year" stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="population"
                stroke="#004AAD"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chamado para ação */}
      <div className="text-center mt-12">
        <Button variant="primary">Saiba Como Ajudar</Button>
      </div>
    </section>
  );
};

export default Information;
