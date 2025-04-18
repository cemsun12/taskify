import "./globals.css";
import { Toaster } from "sonner";

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
            <Toaster position="top-right" richColors />
        </html>
    );
}
