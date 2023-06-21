import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { AppProps } from "next/app";
import Head from "next/head";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/fr";
import Layout from "../components/layout";
import { FirestoreProvider } from "@/contexts/firestore";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>RAC Volley - Tools</title>
      </Head>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
        <FirestoreProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </FirestoreProvider>
      </LocalizationProvider>
    </>
  );
}
