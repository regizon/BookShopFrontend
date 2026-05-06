import styles from "./Footer.module.css";
import { Link } from "react-router";

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerInner}>
                <div className={styles.topSection}>
                    <div className={styles.brand}>
                        <Link to="/" className={styles.logoText}>
                            <span className={styles.logoBlack}>BOOK</span>
                            <span className={styles.logoBlue}>HEAVEN</span>
                        </Link>
                        <p className={styles.tagline}>
                            Найбільший вибір книг для кожного читача. Доставляємо радість читання до вашого дому.
                        </p>
                        <div className={styles.socials}>
                            <a href="#" className={styles.socialLink} aria-label="Instagram">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                                </svg>
                            </a>
                            <a href="#" className={styles.socialLink} aria-label="Facebook">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                                </svg>
                            </a>
                            <a href="#" className={styles.socialLink} aria-label="Telegram">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m22 2-7 20-4-9-9-4Z"/>
                                    <path d="M22 2 11 13"/>
                                </svg>
                            </a>
                            <a href="#" className={styles.socialLink} aria-label="YouTube">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
                                    <path d="m10 15 5-3-5-3z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className={styles.linksGroup}>
                        <h4 className={styles.groupTitle}>Покупцям</h4>
                        <ul className={styles.linksList}>
                            <li><Link to="/" className={styles.footerLink}>Каталог книг</Link></li>
                            <li><Link to="/" className={styles.footerLink}>Бестселери</Link></li>
                            <li><Link to="/" className={styles.footerLink}>Новинки</Link></li>
                            <li><Link to="/" className={styles.footerLink}>Акції та знижки</Link></li>
                            <li><Link to="/" className={styles.footerLink}>Подарункові сертифікати</Link></li>
                        </ul>
                    </div>

                    <div className={styles.linksGroup}>
                        <h4 className={styles.groupTitle}>Компанія</h4>
                        <ul className={styles.linksList}>
                            <li><Link to="/" className={styles.footerLink}>Про нас</Link></li>
                            <li><Link to="/" className={styles.footerLink}>Блог</Link></li>
                            <li><Link to="/" className={styles.footerLink}>Видавництвам</Link></li>
                            <li><Link to="/" className={styles.footerLink}>Партнерам</Link></li>
                            <li><Link to="/" className={styles.footerLink}>Контакти</Link></li>
                        </ul>
                    </div>

                    <div className={styles.linksGroup}>
                        <h4 className={styles.groupTitle}>Допомога</h4>
                        <ul className={styles.linksList}>
                            <li><Link to="/" className={styles.footerLink}>Доставка і оплата</Link></li>
                            <li><Link to="/" className={styles.footerLink}>Повернення товару</Link></li>
                            <li><Link to="/" className={styles.footerLink}>Відстеження замовлення</Link></li>
                            <li><Link to="/" className={styles.footerLink}>Часті запитання</Link></li>
                            <li><Link to="/" className={styles.footerLink}>Служба підтримки</Link></li>
                        </ul>
                    </div>

                    <div className={styles.contactGroup}>
                        <h4 className={styles.groupTitle}>Контакти</h4>
                        <div className={styles.contactItem}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                            </svg>
                            <span>0 800 123 456</span>
                        </div>
                        <div className={styles.contactItem}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="20" height="16" x="2" y="4" rx="2"/>
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                            </svg>
                            <span>support@bookheaven.ua</span>
                        </div>
                        <div className={styles.contactItem}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                            </svg>
                            <span>Пн–Пт: 9:00–18:00</span>
                        </div>
                        <div className={styles.deliveryBadge}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/>
                                <rect width="13" height="8" x="9" y="11" rx="1"/>
                                <circle cx="11" cy="19" r="2"/>
                                <circle cx="19" cy="19" r="2"/>
                            </svg>
                            <span>Безкоштовна доставка від 500 ₴</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.bottomBar}>
                <div className={styles.bottomInner}>
                    <span className={styles.copyright}>
                        © {new Date().getFullYear()} BookHeaven. Усі права захищено.
                    </span>
                    <div className={styles.bottomLinks}>
                        <Link to="/" className={styles.bottomLink}>Політика конфіденційності</Link>
                        <Link to="/" className={styles.bottomLink}>Умови використання</Link>
                        <Link to="/" className={styles.bottomLink}>Угода користувача</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
