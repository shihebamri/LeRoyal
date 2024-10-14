import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Gift, Clock, Calendar, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';

export default function Component() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState<number | null>(null);
  const [showHeader, setShowHeader] = useState(false);
  const [showGiftCard, setShowGiftCard] = useState(false);
  const [currentGalleryImage, setCurrentGalleryImage] = useState(0);
  const [activeDay, setActiveDay] = useState(0);

  const services = [
    { name: 'Hammem', image: '/1.jpg', description: 'Hammem', duration: '90 min', price: '250DNT' },
    { name: 'Soin du Visage', image: '/7.avif', description: 'Soin du Visage', duration: '60 min', price: '200DNT' },
    { name: 'Massage', image: '/8.jpg', description: 'Massage', duration: '120 min', price: '300DNT' },
    { name: 'Pédicure et Manucure', image: '/9.jpg', description: 'Pédicure et Manucure', duration: '75 min', price: '180DNT' },
];


const schedule = [
    { day: 'Lundi', morning: ['de 9h à 16h'], afternoon: ['de 17h à 20h'] },
    { day: 'Mardi', morning: ['de 12h à 20h'], afternoon: ['de 6h à 11h'] },
    { day: 'Mercredi', morning: ['Jour de repos'], afternoon: ['de 12h à 20h'] },
    { day: 'Jeudi', morning: ['de 10h à 16h'], afternoon: ['de 6h à 10h et de 17h à 20h'] },
    { day: 'Vendredi', morning: ['de 10h à 16h'], afternoon: ['de 6h à 10h et de 17h à 20h'] },
    { day: 'Samedi', morning: ['de 12h à 20h'], afternoon: ['de 6h à 11h'] },
    { day: 'Dimanche', morning: ['de 10h à 16h'], afternoon: ['de 6h à 10h et de 17h à 20h'] },
  ];
  

  const galleryImages = [
    '/1.jpg',
    '/2.jpg',
    '/3.jpg',
    '/4.jpg',
    '/5.jpg',
    '/6.jpg',
  ];
  

  const [headerRef, headerInView] = useInView({
    threshold: 0,
  });

  useEffect(() => {
    setShowHeader(!headerInView);
  }, [headerInView]);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    setShowHeader(scrollPosition > 100);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);

  const parallaxRef = useRef(null);

  const sendToTelegram = async (formData: FormData) => {
    const botToken = 'YOUR_BOT_TOKEN';
    const chatId = 'YOUR_CHAT_ID';
    const text = `Nouvelle Réservation:
Nom: ${formData.get('name')}
Email: ${formData.get('email')}
Téléphone: ${formData.get('phone')}
Service: ${formData.get('service')}
Date: ${formData.get('date')}
Heure: ${formData.get('time')}`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    });

    if (!response.ok) {
      throw new Error('Échec de l\'envoi du message à Telegram');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      await sendToTelegram(formData);
      alert('Réservation soumise avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réservation:', error);
      alert('Échec de la soumission de la réservation. Veuillez réessayer.');
    }
  };

  return (
    <div className="le-royal-hammam">
      <header className={`floating-header ${showHeader ? 'visible' : ''}`}>
        <div className="logo">Le Royal</div>
        <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu">
          <Menu size={24} />
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="overlay-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button className="close-menu" onClick={() => setMenuOpen(false)} aria-label="Fermer le menu">
              <X size={24} />
            </button>
            <nav>
              <ul>
                <motion.li whileHover={{ scale: 1.1 }}><a href="#services" onClick={() => setMenuOpen(false)}>Services</a></motion.li>
                <motion.li whileHover={{ scale: 1.1 }}><a href="#about" onClick={() => setMenuOpen(false)}>À Propos</a></motion.li>
                <motion.li whileHover={{ scale: 1.1 }}><a href="#gallery" onClick={() => setMenuOpen(false)}>Galerie</a></motion.li>
                <motion.li whileHover={{ scale: 1.1 }}><a href="#schedule" onClick={() => setMenuOpen(false)}>Horaires</a></motion.li>
                <motion.li whileHover={{ scale: 1.1 }}><a href="#booking" onClick={() => setMenuOpen(false)}>Réservation</a></motion.li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="hero" ref={headerRef}>
        <video autoPlay loop muted playsInline className="hero-video">
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Plongez dans le Luxe Absolu
        </motion.h1>
        <motion.a
          href="#booking"
          className="book-now-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Réservez Votre Expérience Luxueuse
        </motion.a>
      </section>

      <section id="services" className="services">
        <h2>Nos Services Exquis</h2>
        <div className="service-carousel">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="service-card"
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveService(index)}
            >
              <img src={service.image} alt={service.name} />
              <h3>{service.name}</h3>
              <p className="service-duration"><Clock className="icon" /> {service.duration}</p>
              <p className="service-price">{service.price}</p>
            </motion.div>
          ))}
        </div>
        <AnimatePresence>
          {activeService !== null && (
            <motion.div
              className="service-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="service-details">
                <h3>{services[activeService].name}</h3>
                <p>{services[activeService].description}</p>
                <p><Clock className="icon" /> Durée: {services[activeService].duration}</p>
                <p>Prix: {services[activeService].price}</p>
                <motion.button
                  className="book-now-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveService(null)}
                >
                  Réserver Maintenant
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section id="about" className="about">
        <div className="about-content">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Vivez l'Apogée du Luxe
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Au Royal, nous croyons en l'offre d'une expérience inégalée de relaxation et de rajeunissement. Notre équipe de thérapeutes experts combine des techniques ancestrales avec le luxe moderne pour créer des soins sur mesure qui répondent à tous vos besoins.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            De nos somptueux massages infusés d'or à nos soins du visage de pointe, chaque service est conçu pour vous transporter dans un monde de pure indulgence. Entrez dans notre sanctuaire et laissez-nous vous choyer avec les produits les plus raffinés et le service le plus attentif.
          </motion.p>
          <motion.a
            href="#booking"
            className="book-now-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Réservez Votre Évasion
          </motion.a>
        </div>
        <div className="about-image">
          <img src="/5.jpg" alt="Intérieur luxueux du hammam" />
        </div>
      </section>

      <section id="gallery" className="gallery">
        <h2>Notre Sanctuaire Luxueux</h2>
        <div className="gallery-container">
          <button className="gallery-nav prev" onClick={() => setCurrentGalleryImage((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))} aria-label="Image précédente">
            <ChevronLeft />
          </button>
          <div className="gallery-image-container">
            {galleryImages.map((image, index) => (
              <motion.img
                key={index}
                src={image}
                alt={`Image de la galerie du hammam ${index + 1}`}
                className={index === currentGalleryImage ? 'active' : ''}
                initial={{ opacity: 0 }}
                animate={{ opacity: index === currentGalleryImage ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              />
            ))}
          </div>
          <button className="gallery-nav next" onClick={() => setCurrentGalleryImage((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))} aria-label="Image suivante">
            <ChevronRight />
          </button>
        </div>
      </section>

      <section id="schedule" className="schedule">
        <h2>Notre Programme Hebdomadaire</h2>
        <div className="schedule-container">
          <div className="schedule-days">
            {schedule.map((day, index) => (
              <motion.button
                key={index}
                className={`schedule-day-button ${index === activeDay ? 'active' : ''}`}
                onClick={() => setActiveDay(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {day.day}
              </motion.button>
            ))}
          </div>
          <motion.div 
            className="schedule-details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3>{schedule[activeDay].day}</h3>
            <div className="schedule-time-slots">
              <div className="morning-slot">
                <h4> Femme</h4>
                
                <ul>
                  {schedule[activeDay].morning.map((service, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      
                    >
                      {service}
                    </motion.li>
                    
                  ))}
                  
                </ul><Clock size={16}/>
              </div>
              <div className="afternoon-slot">
                <h4> Homme</h4>
                <ul>
                  {schedule[activeDay].afternoon.map((service, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {service}
                    </motion.li>
                  ))}
                </ul><Clock size={16}/>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="booking" className="booking">
        <h2>Réservez Votre Moment de Luxe</h2>
        <form className="booking-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Votre Nom" required />
          <input type="email" name="email" placeholder="Votre Email" required />
          <input type="tel" name="phone" placeholder="Votre Téléphone" required />
          <select name="service" required>
            <option value="">Sélectionnez Votre Expérience Désirée</option>
            {services.map((service, index) => (
              <option key={index} value={service.name}>{service.name}</option>
            ))}
          </select>
          <input type="date" name="date" required />
          <input type="time" name="time" required />
          <motion.button
            type="submit"
            className="submit-button"
            
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Confirmer la Réservation
          </motion.button>
        </form>
      </section>

      <section className="gift-card">
        <motion.button
          className="gift-card-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowGiftCard(true)}
        >
          <Gift className="icon" /> Offrez l'Expérience du Luxe
        </motion.button>
        <AnimatePresence>
          {showGiftCard && (
            <motion.div
              className="gift-card-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="gift-card-content">
                <h3>Offrez une Expérience Luxueuse</h3>
                <p>Surprenez vos proches avec le cadeau d'une relaxation et d'une indulgence ultimes.</p>
                <form>
                  <input type="text" placeholder="Nom du Bénéficiaire" required />
                  <input type="email" placeholder="Email du Bénéficiaire" required />
                  <input type="number" placeholder="Montant de la Carte Cadeau" required min="50" step="10" />
                  <textarea placeholder="Message Personnel (Optionnel)"></textarea>
                  <motion.button
                    type="submit"
                    className="submit-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Acheter la Carte Cadeau
                  </motion.button>
                </form>
                <button className="close-gift-card" onClick={() => setShowGiftCard(false)} aria-label="Fermer le formulaire de carte cadeau">
                  <X size={24} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <footer className="footer">
        <div className="social-icons">
          <motion.a href="https://www.facebook.com/profile.php?id=100089134323395" whileHover={{ scale: 1.2 }}><Facebook size={24} /></motion.a>
          <motion.a href="#" whileHover={{ scale: 1.2 }}><Instagram size={24} /></motion.a>
        </div>
        <div className="contact-info">
          <motion.a href="tel:+216 76 225 278" whileHover={{ scale: 1.1 }}><Phone size={16} />  +216 76 225 278</motion.a>
          <motion.a href="mailto:Jallouli440@outlook.com" whileHover={{ scale: 1.1 }}><Mail size={16} />  Allouli440@outlook.com</motion.a>
          <motion.a href="#" whileHover={{ scale: 1.1 }}><MapPin size={16} />  Rue Houcine Bouzaiane، Gafsa</motion.a>
        </div>
        <div className="map-container">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26326.68722401077!2d8.763025933812724!3d34.430923120404316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12f897dd56f6780f%3A0xdb7d8bb565e4d0b9!2sHammam%20le%20Royal!5e0!3m2!1sen!2stn!4v1728928608764!5m2!1sen!2stn"
    width="600"
    height="450"
    style={{ border: "0" }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title="Hammam le Royal"
  ></iframe>
</div>


        <p className="copyright">© 2024 Le Royal. Tous droits réservés. Site Web desgined By Chiheb Amri</p>
      </footer>

      <style>{`

        .map-container {
  position: relative;
  width: 100%;
  max-width: 100%; /* Optional: add if you want to limit the size */
  height: 0;
  padding-bottom: 56.25%; /* Aspect ratio of 16:9 (you can adjust for different ratios) */
  overflow: hidden;
  background: #eaeaea; /* Placeholder background color if needed */
}

    .map-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}



        .schedule {
          padding: 3rem 1rem;
          background-color: var(--color-off-black);
        }

        .schedule h2 {
          text-align: center;
          color: var(--color-gold);
          margin-bottom: 2rem;
          font-size: 1.75rem;
        }

        .schedule-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .schedule-days {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2rem;
          overflow-x: auto;
          padding-bottom: 1rem;
        }

        .schedule-day-button {
          background-color: var(--color-charcoal);
          color: var(--color-light-gold);
          border: none;
          padding: 0.5rem 1rem;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 20px;
        }

        .schedule-day-button.active {
          background-color: var(--color-gold);
          color: var(--color-black);
        }

        .schedule-details {
          background-color: var(--color-charcoal);
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(255, 215, 0, 0.1);
        }

        .schedule-details h3 {
          color: var(--color-gold);
          font-size: 1.5rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        .schedule-time-slots {
          display: flex;
          justify-content: space-between;
          gap: 2rem;
        }

        .morning-slot, .afternoon-slot {
          flex: 1;
        }

        .morning-slot h4, .afternoon-slot h4 {
          color: var(--color-gold);
          font-size: 1.2rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .schedule-details ul {
          list-style-type: none;
          padding: 0;
        }

        .schedule-details li {
          color: var(--color-light-gold);
          margin-bottom: 0.5rem;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .schedule-details li:hover {
          color: var(--color-gold);
          transform: translateX(5px);
        }

        @media (max-width: 768px) {
          .schedule-time-slots {
            flex-direction: column;
          }

          .schedule-days {
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.5rem;
          }

          .schedule-day-button {
            margin-bottom: 0.5rem;
          }
        }

        :root {
          --color-gold: #FFD700;
          --color-light-gold: #FFF8DC;
          --color-dark-gold: #B8860B;
          --color-black: #000000;
          --color-off-black: #1A1A1A;
          --color-charcoal: #36454F;
        }
        
        .luxurious-spa {
          font-family: 'Playfair Display', serif;
          color: var(--color-light-gold);
          background-color: var(--color-black);
        }

        .floating-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background-color: rgba(0, 0, 0, 0.9);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          z-index: 1000;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .floating-header.visible {
          opacity: 1;
        }

        .logo {
          color: var(--color-gold);
          font-size: 1.25rem;
          font-weight: bold;
        }

        .menu-button {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-gold);
        }

        .overlay-menu {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, var(--color-black), var(--color-off-black));
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 2000;
        }

        .close-menu {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: var(--color-gold);
          font-size: 1.5rem;
          cursor: pointer;
        }

        .overlay-menu nav ul {
          list-style: none;
          padding: 0;
          text-align: center;
        }

        .overlay-menu nav ul li {
          margin: 1.5rem 0;
        }

        .overlay-menu nav ul li a {
          color: var(--color-gold);
          font-size: 1.5rem;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .overlay-menu nav ul li a:hover {
          color: var(--color-light-gold);
        }

        .hero {
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .hero-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(50%);
        }

        .hero h1 {
          font-size: 2rem;
          color: var(--color-gold);
          text-align: center;
          z-index: 1;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          padding: 0 1rem;
        }

        .book-now-button {
          background-color: var(--color-gold);
          color: var(--color-black);
          border: none;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
          margin-top: 1.5rem;
          z-index: 1;
        }

        .book-now-button:hover {
          background-color: var(--color-dark-gold);
        }

        .services {
          padding: 3rem 1rem;
          background-color: var(--color-off-black);
        }

        .services h2 {
          text-align: center;
          margin-bottom: 2rem;
          color: var(--color-gold);
          font-size: 1.75rem;
        }

        .service-carousel {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .service-card {
          background-color: var(--color-charcoal);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(255, 215, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .service-card:hover {
          transform: translateY(-5px);
        }

        .service-card img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .service-card h3 {
          padding: 1rem;
          text-align: center;
          color: var(--color-gold);
          font-size: 1.25rem;
        }

        .service-duration, .service-price {
          text-align: center;
          color: var(--color-light-gold);
          margin: 0.5rem 0;
          font-size: 0.9rem;
        }

        .icon {
          vertical-align: middle;
          margin-right: 0.5rem;
        }

        .service-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 1rem;
        }

        .service-details {
          background-color: var(--color-off-black);
          padding: 1.5rem;
          border-radius: 8px;
          max-width: 100%;
          color: var(--color-light-gold);
        }

        .about {
          padding: 3rem 1rem;
          background-color: var(--color-black);
        }

        .about-content {
          text-align: center;
          margin-bottom: 2rem;
        }

        .about h2 {
          color: var(--color-gold);
          font-size: 1.75rem;
          margin-bottom: 1rem;
        }

        .about p {
          color: var(--color-light-gold);
          margin-bottom: 1rem;
          font-size: 1rem;
        }

        .about-image {
          width: 100%;
          height: auto;
          border-radius: 8px;
          overflow: hidden;
        }

        .about-image img {
          width: 100%;
          height: auto;
          object-fit: cover;
        }

        .gallery {
          padding: 3rem 1rem;
          background-color: var(--color-off-black);
        }

        .gallery h2 {
          text-align: center;
          color: var(--color-gold);
          margin-bottom: 2rem;
          font-size: 1.75rem;
        }

        .gallery-container {
          position: relative;
          max-width: 100%;
          margin: 0 auto;
        }

        .gallery-image-container {
          position: relative;
          width: 100%;
          height: 0;
          padding-bottom: 66.67%; /* 3:2 aspect ratio */
          overflow: hidden;
        }

        .gallery-image-container img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .gallery-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.5);
          color: var(--color-gold);
          border: none;
          font-size: 1.5rem;
          padding: 0.5rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .gallery-nav:hover {
          background-color: rgba(0, 0, 0, 0.8);
        }

        .gallery-nav.prev {
          left: 0.5rem;
        }

        .gallery-nav.next {
          right: 0.5rem;
        }

        .testimonials {
          padding: 3rem 1rem;
          background-color: var(--color-black);
        }

        .testimonials h2 {
          text-align: center;
          color: var(--color-gold);
          margin-bottom: 2rem;
          font-size: 1.75rem;
        }

        .testimonial-container {
          position: relative;
          max-width: 100%;
          margin: 0 auto;
          height: auto;
          min-height: 250px;
        }

        .testimonial-card {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          background-color: var(--color-charcoal);
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(255, 215, 0, 0.1);
        }

        .testimonial-card p {
          font-style: italic;
          margin-bottom: 1rem;
          font-size: 1rem;
        }

        .client-info {
          display: flex;
          align-items: center;
        }

        .client-info img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 1rem;
        }

        .client-info span {
          color: var(--color-gold);
          font-weight: bold;
          font-size: 0.9rem;
        }

        .rating {
          margin-left: auto;
        }

        .star {
          color: var(--color-gold);
          font-size: 0.9rem;
        }

        .testimonial-nav {
          display: flex;
          justify-content: center;
          margin-top: 10px;
        }

        .testimonial-nav button {
          background: none;
          border: none;
          color: var(--color-gold);
          font-size: 1.5rem;
          cursor: pointer;
          margin: 0 0.5rem;
        }

        .booking {
          padding: 3rem 1rem;
          background-color: var(--color-off-black);
        }

        .booking h2 {
          text-align: center;
          margin-bottom: 2rem;
          color: var(--color-gold);
          font-size: 1.75rem;
        }

        .booking-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 100%;
          margin: 0 auto;
        }

        .booking-form input,
        .booking-form select {
          padding: 0.75rem;
          border: 1px solid var(--color-gold);
          border-radius: 4px;
          font-size: 1rem;
          background-color: var(--color-charcoal);
          color: var(--color-light-gold);
        }

        .submit-button {
          background-color: var(--color-gold);
          color: var(--color-black);
          border: none;
          padding: 0.75rem;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .submit-button:hover {
          background-color: var(--color-dark-gold);
        }

        .gift-card {
          padding: 2rem 1rem;
          background-color: var(--color-black);
          text-align: center;
        }

        .gift-card-button {
          background-color: var(--color-gold);
          color: var(--color-black);
          border: none;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .gift-card-button:hover {
          background-color: var(--color-dark-gold);
        }

        .gift-card-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 1rem;
        }

        .gift-card-content {
          background-color: var(--color-off-black);
          padding: 1.5rem;
          border-radius: 8px;
          max-width: 100%;
          color: var(--color-light-gold);
          position: relative;
        }

        .gift-card-content h3 {
          color: var(--color-gold);
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .gift-card-content form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .gift-card-content input,
        .gift-card-content textarea {
          padding: 0.75rem;
          border: 1px solid var(--color-gold);
          border-radius: 4px;
          font-size: 1rem;
          background-color: var(--color-charcoal);
          color: var(--color-light-gold);
        }

        .close-gift-card {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: none;
          border: none;
          color: var(--color-gold);
          font-size: 1.5rem;
          cursor: pointer;
        }

        .footer {
          background-color: var(--color-black);
          color: var(--color-gold);
          padding: 2rem 1rem;
          text-align: center;
        }

        .social-icons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .social-icons a {
          color: var(--color-gold);
          font-size: 1.5rem;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .contact-info a {
          color: var(--color-gold);
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
        }

        .map img {
          max-width: 100%;
          border: 2px solid var(--color-gold);
          border-radius: 8px;
        }

        .copyright {
          margin-top: 1rem;
          font-size: 0.8rem;
          color: var(--color-light-gold);
        }

        @media (min-width: 768px) {
          .hero h1 {
            font-size: 3rem;
          }

          .service-carousel {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
          }

          .service-card {
            flex: 0 0 calc(50% - 1rem);
          }

          .about {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .about-content {
            flex: 1;
            margin-right: 2rem;
            margin-bottom: 0;
            text-align: left;
          }

          .about-image {
            flex: 1;
          }

          .testimonial-container {
            height: 250px;
          }

          .contact-info {
            flex-direction: row;
            justify-content: center;
            gap: 2rem;
          }
        }

        @media (min-width: 1024px) {
          .hero h1 {
            font-size: 4rem;
          }

          .services h2,
          .about h2,
          .gallery h2,
          .testimonials h2,
          .booking h2 {
            font-size: 2.5rem;
          }

          .service-card {
            flex: 0 0 calc(25% - 1rem);
          }

          .about-content {
            max-width: 50%;
          }

          .about-image {
            max-width: 45%;
          }

          .gallery-container {
            max-width: 800px;
          }

          .testimonial-container {
            max-width: 600px;
          }

          .booking-form {
            max-width: 500px;
          }
        }
      `}</style>
    </div>
  );
}