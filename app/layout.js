import { Providers } from "./providers";

import "./globals.css";


export const metadata = {
  title: "CashFlow - Контролирай парите си",
  description: "Следи лесно и бързо, къде, защо и кога отиват твоите приходи.",
};


export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
