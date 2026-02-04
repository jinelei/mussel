import React, {type CSSProperties} from 'react';

interface FooterProps {
    copyrightText?: string;
    year?: number;
    styles?: CSSProperties;
    className: any;
    children?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({
                                           copyrightText = '© {year} jinelei.com',
                                           year = new Date().getFullYear(),
                                           className,
                                           styles = {},
                                           children
                                       }) => {
    const formattedCopyright = copyrightText.replace('{year}', year.toString());

    return (
        <footer className={className} style={{...styles}}>
            <p className="copyright-text">{formattedCopyright}</p>
            {children && <div className="footer-children">{children}</div>}
        </footer>
    );
};

export default Footer;