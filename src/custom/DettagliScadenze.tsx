// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("DettagliScadenze");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("DettagliScadenze");
import { useState } from "react";
import { Button, Card, Dialog, Field, useTable } from "../floware";

export default function DettagliScadenze({ pageId }) {__mk();
  const table = useTable(pageId);
  const [selezione, setSelezione] = useState(null);
  if (pageId !== "scadenze" && pageId !== "scadenze-altro-ufficio") return null;
  if (!table) return null;
  const descrizione = table.column("Descrizione");
  const data = table.column("Data");
  if (descrizione < 0) return <p>Colonna Descrizione non disponibile.</p>;
  const riga = selezione && selezione.pagina === pageId ? table.rows[selezione.indice] : null;
  function mostraData(valore) {__mk();
    if (!valore) return "—";
    if (valore.startsWith("+") || valore.startsWith("-")) {
      const giorni = Number(valore);
      if (Number.isFinite(giorni)) {
        const giorno = new Date();
        giorno.setDate(giorno.getDate() + giorni);
        return giorno.toLocaleDateString("it-IT");
      }
    }
    return valore;
  }
  return (
    <Card title="Apri il dettaglio di una scadenza">
      <div className="space-y-3">
        <p className="text-(--mk-muted)">Seleziona una scadenza per consultarne tutti i campi.</p>
        <div className="max-h-64 overflow-auto space-y-2">
          {table.rows.map((r, indice) => (
            (__mk(), <div key={indice} className="border-b border-(--mk-divider) pb-2">
              <Button variant="link" onClick={() => (__mk(), setSelezione({ pagina: pageId, indice }))}>{r[descrizione] || "Scadenza senza descrizione"}</Button>
              {data >= 0 && <p className="text-sm text-(--mk-muted)">{mostraData(r[data])}</p>}
            </div>)
          ))}
          {table.rows.length === 0 && <p>Nessuna scadenza presente.</p>}
        </div>
      </div>
      {riga && (
        <Dialog title="Dettaglio della scadenza" onClose={() => (__mk(), setSelezione(null))} footer={<Button onClick={() => (__mk(), setSelezione(null))}>Chiudi</Button>}>
          <div className="space-y-4">
            {table.columns.map((colonna) => {__mk();
              const indice = table.column(colonna);
              const valore = indice >= 0 ? riga[indice] : "";
              return <Field key={colonna} label={colonna}>{colonna === "Data" ? mostraData(valore) : valore || "—"}</Field>;
            })}
          </div>
        </Dialog>
      )}
    </Card>
  );
}
