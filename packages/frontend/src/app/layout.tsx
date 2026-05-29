export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <h1>SaaS Multi-Tenant Platform</h1>
        {children}
      </body>
    </html>
  );
}
