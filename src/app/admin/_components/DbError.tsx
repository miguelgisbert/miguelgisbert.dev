import { AdminIcon } from './Icons';

function clean(message: string) {
  return message.replace(/postgres(?:ql)?:\/\/\S+/gi, '[connection string]').slice(0, 220);
}

export function DbError({ error }: { error: unknown }) {
  const detail = clean(error instanceof Error ? error.message : String(error));
  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Base de dades no disponible</h1>
          <p className="adm-sub">
            El panell no ha pogut connectar amb Neon. Comprova que <code>DATABASE_URL</code> siga vàlida i que el
            projecte estiga actiu.
          </p>
        </div>
      </header>
      <section className="adm-card">
        <div className="adm-empty adm-empty--icon">
          <span className="adm-empty-icon">
            <AdminIcon name="alert" size={22} />
          </span>
          <strong>No s’ha pogut carregar la informació</strong>
          L’agent i la resta del panell no es veuen afectats. Torna-ho a provar quan la connexió es restablisca.
        </div>
      </section>
      {detail ? <p className="adm-note">Detall: {detail}</p> : null}
    </>
  );
}
