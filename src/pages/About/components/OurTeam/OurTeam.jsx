import React, { useRef, useEffect } from 'react';
import styles from './OurTeam.module.css';

function OurTeam() {
  const sectionRef = useRef(null);
  
  const teamMembers = [
    {
      name: 'Ana García',
      position: 'Fundadora y CEO',
      description: 'Con más de 15 años de experiencia en el sector, Ana lidera nuestra visión estratégica.',
      photoUrl: 'https://picsum.photos/id/1027/300/300'
    },
    {
      name: 'Carlos Martínez',
      position: 'Director de Operaciones',
      description: 'Carlos se asegura de que cada pedido llegue a tiempo y en perfectas condiciones.',
      photoUrl: 'https://picsum.photos/id/1074/300/300'
    },
    {
      name: 'Laura Rodríguez',
      position: 'Directora de Atención al Cliente',
      description: 'Laura y su equipo están siempre disponibles para resolver cualquier duda o necesidad.',
      photoUrl: 'https://picsum.photos/id/1062/300/300'
    }
  ];

  useEffect(() => {
    // Configurar la detección de visibilidad para animación
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          sectionRef.current.classList.add(styles.visible);
          
          // Añadimos una animación en cascada para cada miembro del equipo
          const members = sectionRef.current.querySelectorAll(`.${styles.teamMember}`);
          members.forEach((member, index) => {
            setTimeout(() => {
              member.classList.add(styles.visible);
            }, 300 * index);
          });
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.teamSection}>
      <h2 className={styles.sectionTitle}>Nuestro Equipo</h2>
      <div className={styles.teamGrid}>
        {teamMembers.map((member, index) => (
          <div key={index} className={styles.teamMember}>
            <div className={styles.memberPhoto}>
              <img src={member.photoUrl} alt={member.name} />
              <div className={styles.memberOverlay}>
                <div className={styles.memberSocial}>
                  <a href="#" aria-label="LinkedIn">
                    <i className="fab fa-linkedin"></i>
                  </a>
                </div>
              </div>
            </div>
            <h3 className={styles.memberName}>{member.name}</h3>
            <p className={styles.memberPosition}>{member.position}</p>
            <p className={styles.memberDescription}>{member.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default OurTeam;