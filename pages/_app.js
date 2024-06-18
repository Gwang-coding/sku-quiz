// pages/_app.js 또는 원하는 페이지의 파일에서 수정할 수 있습니다.
import Head from 'next/head';
import '../styles/globals.css';
function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                {/* 기본 favicon 설정 */}
                <link rel="icon" href="/favicon.ico" />

                {/* 다양한 사이즈의 favicon을 지원할 경우 */}
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="theme-color" content="#ffffff" />
            </Head>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
