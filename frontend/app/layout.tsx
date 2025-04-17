import "./globals.css";

export const metadata = {
    title: "Taskify",
    description: "Görev yönetimi uygulaması",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
