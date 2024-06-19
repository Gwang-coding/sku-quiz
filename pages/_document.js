import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import Script from 'next/script'; // next/script 모듈을 사용

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
                });

            const initialProps = await Document.getInitialProps(ctx);
            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            };
        } finally {
            sheet.seal();
        }
    }
    render() {
        return (
            <Html>
                <Head>{/* <script src="https://developers.kakao.com/sdk/js/kakao.min.js"></script> 을 아래로 변경 */}</Head>
                <body>
                    <Main />
                    <NextScript />
                    <Script src="https://developers.kakao.com/sdk/js/kakao.min.js" strategy="beforeInteractive" />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
