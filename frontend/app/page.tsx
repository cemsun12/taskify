export default function Home() {
    return (
        <main className="min-h-screen bg-white text-gray-800">
            {/* Hero */}
            <section className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-24 px-6 text-center">
                <h1 className="text-5xl font-extrabold mb-4">Taskify</h1>
                <p className="text-xl max-w-xl mx-auto">
                    Modern, hızlı ve verimli görev yönetimi uygulaması.
                    Projelerini ve işlerini kolayca takip et.
                </p>
                <div className="mt-8">
                    <a
                        href="#features"
                        className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100 transition"
                    >
                        Hemen Keşfet
                    </a>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-20 px-6 max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Özellikler
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <Feature
                        icon="✅"
                        title="Görev Takibi"
                        desc="Tüm görevlerini tek panelde görüntüle ve yönet."
                    />
                    <Feature
                        icon="⚡"
                        title="Hızlı Performans"
                        desc="Laravel + Next.js altyapısı ile süper hızlı."
                    />
                    <Feature
                        icon="📱"
                        title="Mobil Uyumlu"
                        desc="Tüm cihazlarda harika görünür, tamamen responsive."
                    />
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gray-100 text-center">
                <h3 className="text-3xl font-semibold mb-4">
                    Görevlerine Hükmet
                </h3>
                <p className="text-lg mb-6">
                    Taskify ile zamanını iyi kullan. Hemen şimdi başla!
                </p>
                <a
                    href="/dashboard"
                    className="bg-blue-600 text-white px-6 py-3 rounded font-medium hover:bg-blue-700 transition"
                >
                    Başla
                </a>
            </section>

            {/* Footer */}
            <footer className="py-6 text-center text-sm text-gray-500 border-t">
                &copy; {new Date().getFullYear()} Taskify. Tüm hakları saklıdır.
            </footer>
        </main>
    );
}

function Feature({
    icon,
    title,
    desc,
}: {
    icon: string;
    title: string;
    desc: string;
}) {
    return (
        <div className="bg-white shadow-md hover:shadow-xl p-6 rounded-lg text-center transition">
            <div className="text-4xl mb-3">{icon}</div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-600">{desc}</p>
        </div>
    );
}
