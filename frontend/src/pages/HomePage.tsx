import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Shield, Cpu, ArrowRight, Image, Wand2 } from 'lucide-react'
import { useTranslation } from '@/i18n/useTranslation'

export default function HomePage() {
  const { t } = useTranslation()

  const features = [
    {
      icon: Cpu,
      title: t.featureLocalAI,
      description: t.featureLocalAIDesc,
    },
    {
      icon: Shield,
      title: t.featurePrivate,
      description: t.featurePrivateDesc,
    },
    {
      icon: Zap,
      title: t.featureMultiple,
      description: t.featureMultipleDesc,
    },
    {
      icon: Image,
      title: t.featureQuality,
      description: t.featureQualityDesc,
    },
  ]

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
              <span className="text-sm text-gray-300">Powered by InsightFace + ONNX</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold mb-6 leading-tight font-display">
              {t.heroTitlePrefix}{' '}
              <span className="gradient-text">{t.heroTitleHighlight}</span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              {t.heroSubtitle}
            </p>
            <Link
              to="/swap"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary hover:bg-primaryHover text-white text-lg font-medium transition-all hover:scale-105"
            >
              {t.heroCta}
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-display">{t.featuresTitle}</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              {t.featuresSubtitle}
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
                <h3 className="text-lg font-semibold mb-2 font-display">{feature.title}</h3>
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
          <h2 className="text-3xl font-bold mb-4 font-display">{t.ctaTitle}</h2>
          <p className="text-gray-400 mb-8">
            {t.ctaSubtitle}
          </p>
          <Link
            to="/swap"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary hover:bg-primaryHover text-white text-lg font-medium transition-all hover:scale-105"
          >
            {t.ctaButton}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
