import styles from './SidebarSection.module.css';

export default function SidebarSection({ children, title }: { children: React.ReactNode, title: string }) {
  return (
    <div className={styles.section}>
      <h4 className={styles.title}>{title}</h4>
      {children}
    </div>
  )
}