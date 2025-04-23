import React from 'react';
import styles from './OurTeam.module.css';

function OurTeam() {
  const teamMembers = [
    {
      name: 'Ana García',
      position: 'Fundadora y CEO',
      description: 'Con más de 15 años de experiencia en el sector, Ana lidera nuestra visión estratégica.'
    },
    {
      name: 'Carlos Martínez',
      position: 'Director de Operaciones',
      description: 'Carlos se asegura de que cada pedido llegue a tiempo y en perfectas condiciones.'
    },
    {
      name: 'Laura Rodríguez',
      position: 'Directora de Atención al Cliente',
      description: 'Laura y su equipo están siempre disponibles para resolver cualquier duda o necesidad.'
    }
  ];

  return (
    <section className={styles.teamSection}>
      <h2 className={styles.sectionTitle}>Nuestro Equipo</h2>
      <div className={styles.teamGrid}>
        {teamMembers.map((member, index) => (
          <div key={index} className={styles.teamMember}>
            <div className={styles.memberPhoto}>
              [Foto]
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