import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

interface PageProps {
    children: React.ReactNode;
}

export const Page: React.FC<PageProps> = ({ children }) => {
    const location = useLocation();
    const [title, setTitle] = useState<string | undefined>();

    useEffect(() => {
        const pageTitle = location.pathname.split('/')[1];
        if (pageTitle) {
            setTitle(`TechnoTrades | ${pageTitle.charAt(0).toUpperCase()}${pageTitle.slice(1)}`);
        } else {
            setTitle('TechnoTrades');
        }

        return () => {
            setTitle('TechnoTrades');
        };
    }, [location.pathname]);

    return (
        <HelmetProvider>
            <Helmet>
                <title>{title}</title>
                <link rel="canonical" href={'http://localhost:5173' + location.pathname} />
            </Helmet>
            {children}
        </HelmetProvider>
    );
};