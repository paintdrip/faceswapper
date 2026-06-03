import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Shield, Cpu, ArrowRight, Image, Wand2 } from 'lucide-react'

const features = [
  {
    icon: Cpu,
    title: 'Локальная AI обработка',
    description: 'Вся обработка происходит на вашем компьютере с помощью моделей InsightFace и FaceFusion.',
  },
  {
    icon: Shield,
    title: '100% приватно',
    description: 'Ваши фото никуда не отправляются. Никакого облака, никаких сторонних API.',
  },
  {
    icon: Zap,
    title: 'Несколько лиц',
    description: 'Автоматически находит и заменяет все лица на фото за один проход.',
  },
  {
    icon: Image,
    title: 'Высокое качество',
    description: 'Максимально доступное качество с продвинутым смешиванием лиц.',
  },
]

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <Wand2 className="w-4 h-4 text-primary" />
              <span className="text-sm text-gray-300">Powered by FaceFusion + InsightFace</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold mb-6 leading-tight">
              Замени лицо на{' '}
              <span className="gradient-text">лицо Димы Данилина</span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Загрузи любое фото и замени все лица на лицо Димы Данилина с помощью
              современных open-source моделей — абсолютно бесплатно и приватно.
            </p>
            <Link
              to="/swap"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary hover:bg-primaryHover text-white text-lg font-medium transition-all hover:scale-105"
            >
              Оформить
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Почему DiminSwap?</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Создано для приватности, скорости и качества с использованием лучших open-source технологий face swap.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 hover:bg-white/5 transition-colors"
              >
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto glass-strong rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to swap some faces?</h2>
          <p className="text-gray-400 mb-8">
            Grab a group photo and see the magic happen. All processing is done locally on your machine.
          </p>
          <Link
            to="/swap"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary hover:bg-primaryHover text-white text-lg font-medium transition-all hover:scale-105"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
