// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("RiepilogoUrgenze");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("RiepilogoUrgenze");
import { useState } from "react";
import { Badge, Button, Card, Dialog, Field, Select, useTable } from "../floware";

export default function RiepilogoUrgenze({ pageId }) {__mk();
  const table = useTable(pageId);
  const [ufficio, setUfficio] = useState("");
  const [responsabile, setResponsabile] = useState("");
  const [selezione, setSelezione] = useState(null);
  if (pageId !== "scadenze" && pageId !== "scadenze-altro-ufficio") return null;
  if (!table) return null;
  const descrizione = table.column("Descrizione");
  const data = table.column("Data");
  const uff = table.column("Ufficio");
  const resp = table.column("Responsabile");
  const completata = table.column("Completata");
  if ([descrizione, data, uff, resp, completata].some((i) => (__mk(), i < 0))) return <p>Riepilogo non disponibile: mancano alcune colonne delle scadenze.</p>;
  const oggi = new Date();
  const base = Date.UTC(oggi.getFullYear(), oggi.getMonth(), oggi.getDate());
  function leggiData(testo) {__mk();
    const valore = String(testo || "").trim();
    if (!valore) return null;
    if (valore.startsWith("+") || valore.startsWith("-")) {
      const offset = Number(valore);
      return Number.isFinite(offset) ? new Date(base + offset * 86400000) : null;
    }
    const italiana = valore.includes("/");
    const parti = italiana ? valore.split("/") : valore.split("-");
    if (parti.length !== 3) return null;
    const indiceAnno = italiana ? 2 : 0;
    const indiceGiorno = italiana ? 0 : 2;
    const anno = Number(parti[indiceAnno]);
    const mese = Number(parti[1]);
    const giorno = Number(parti[indiceGiorno]);
    const risultato = new Date(Date.UTC(anno, mese - 1, giorno));
    return risultato.getUTCFullYear() === anno && risultato.getUTCMonth() === mese - 1 && risultato.getUTCDate() === giorno ? risultato : null;
  }
  function mostraData(testo) {__mk();
    const valore = leggiData(testo);
    return valore ? valore.toLocaleDateString("it-IT", { timeZone: "UTC" }) : testo || "—";
  }
  const urgenti = table.rows.map((riga, indice) => {__mk();
    const termine = leggiData(riga[data]);
    const stato = String(riga[completata] || "").trim().toLowerCase();
    const aperta = ["", "—", "-", "no", "false", "0", "non completata", "da completare"].includes(stato);
    return { riga, indice, giorni: termine ? Math.round((termine.getTime() - base) / 86400000) : null, aperta };
  }).filter((voce) => (__mk(), voce.aperta && voce.giorni !== null && voce.giorni < 10)).sort((a, b) => (__mk(), a.giorni - b.giorni));
  const uffici = [...new Set(urgenti.map((voce) => (__mk(), voce.riga[uff])).filter(Boolean))];
  const responsabili = [...new Set(urgenti.map((voce) => (__mk(), voce.riga[resp])).filter(Boolean))];
  const visibili = urgenti.filter((voce) => (__mk(), (!ufficio || voce.riga[uff] === ufficio) && (!responsabile || voce.riga[resp] === responsabile)));
  const indiceScelta = selezione ? selezione.indice : -1;
  const scelta = selezione && selezione.pagina === pageId ? table.rows[indiceScelta] : null;
  return (
    <Card title="Scadenze urgenti">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="danger">{urgenti.length} urgenti aperte</Badge>
          <span className="text-sm text-(--mk-muted)">Scadute o con meno di 10 giorni alla data.</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <Select label="Ufficio" value={ufficio} options={[{ value: "", label: "Tutti gli uffici" }, ...uffici.map((nome) => ((__mk(), { value: nome, label: nome })))]} onChange={setUfficio} />
          <Select label="Responsabile" value={responsabile} options={[{ value: "", label: "Tutti i responsabili" }, ...responsabili.map((nome) => ((__mk(), { value: nome, label: nome })))]} onChange={setResponsabile} />
          <Button variant="secondary" onClick={() => {__mk(); setUfficio(""); setResponsabile(""); }}>Azzera filtri</Button>
        </div>
        <p className="text-sm text-(--mk-muted)">{visibili.length} scadenze visualizzate su {urgenti.length}</p>
        <div className="max-h-64 overflow-auto space-y-2">
          {visibili.map((voce) => (
            (__mk(), <div key={voce.indice} className="border-b border-(--mk-divider) pb-2">
              <Button variant="link" onClick={() => (__mk(), setSelezione({ pagina: pageId, indice: voce.indice }))}>{voce.riga[descrizione] || "Scadenza senza descrizione"}</Button>
              <p className="text-sm text-(--mk-muted)">{mostraData(voce.riga[data])} · {voce.riga[uff] || "Ufficio non indicato"} · {voce.giorni < 0 ? "Scaduta" : voce.giorni === 0 ? "Oggi" : "Tra " + voce.giorni + " giorni"}</p>
            </div>)
          ))}
          {visibili.length === 0 && <p>{urgenti.length === 0 ? "Nessuna scadenza urgente aperta." : "Nessuna urgenza corrisponde ai filtri."}</p>}
        </div>
      </div>
      {scelta && <Dialog title="Dettaglio scadenza urgente" onClose={() => (__mk(), setSelezione(null))} footer={<Button onClick={() => (__mk(), setSelezione(null))}>Chiudi</Button>}>
        <div className="space-y-3">{table.columns.map((nome) => {__mk();
          const indice = table.column(nome);
          const valore = scelta[indice];
          return <Field key={nome} label={nome}>{nome === "Data" ? mostraData(valore) : valore || "—"}</Field>;
        })}</div>
      </Dialog>}
    </Card>
  );
}
