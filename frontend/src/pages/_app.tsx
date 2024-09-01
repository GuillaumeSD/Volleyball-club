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
import { SnackbarProvider } from "notistack";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Calendrier du Vésinet VB club</title>
      </Head>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
        <SnackbarProvider preventDuplicate>
          <FirestoreProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </FirestoreProvider>
        </SnackbarProvider>
      </LocalizationProvider>
    </>
  );
}
