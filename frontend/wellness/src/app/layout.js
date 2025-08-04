import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/redux/providers";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "WellNest",
  description: "Your Health is Your Wealth",
  icons : {
    icon : '/favicon.ico'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
            {children}
            <ToastContainer 
              key="desktop"
              position="top-center"
              newestOnTop ={ false }
              pauseOnFocusLoss = {false}
              pauseOnHover = {false}
              toastClassName={"m-8 max-w-[80%]"}
              theme='light'
            />
        </Providers>
        
      </body>
    </html>
  );
}
