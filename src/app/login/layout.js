import "../globals.css";

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

export const metadata = {
    title: "Dashboard Login",
    description: "",
};

const LoginLayout = ({ children }) => {
    return (
        <html lang="pt-br">
            <body className="bg-gradient-to-r from-rose-700 to-rose-900">{children}</body>
        </html>
    );
};

export default LoginLayout;
