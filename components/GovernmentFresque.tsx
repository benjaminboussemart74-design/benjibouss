import styles from '../styles/fresque.module.css';

interface GovernmentFresqueProps {
  editMode?: boolean;
}

export default function GovernmentFresque({ editMode = false }: GovernmentFresqueProps) {
  return (
    <div className={styles.fresque}>
      <section className={styles.heroSection}>
        <img src="/tigre.png" alt="Tigre blanc" className={styles.heroTigre} />
      </section>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>GOUVERNEMENT LECORNU I</h1>
          <h2 className={styles.subtitle}>23 décembre 2025</h2>
        </div>
      </header>
      <section className={styles.grid}>
        {/* Exemple d’encadré ministre */}
        <div className={styles.personCard}>
          <div className={styles.circleModem}>
            <img src="/placeholder.jpg" alt="François Lecornu" className={styles.photo} />
          </div>
          <div className={styles.personInfo}>
            <span className={styles.personName}>FRANÇOIS LECORNU</span>
            <span className={styles.personRole}>Premier ministre</span>
            <span className={styles.personParty}>Renaissance</span>
          </div>
        </div>
        {/* Ajouter d’autres encadrés ici */}
      </section>
    </div>
  );
}
