import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import logo from "./assets/logo-1.svg";
import "./App.css";

const UNIDADES = [
  { id: 1, nome: "Paulista - SP", uf: "SP", endereco: "Av. Paulista, Nº 1200, Bela Vista, São Paulo - SP", preco: 169.9 },
  { id: 2, nome: "Tatuapé - SP", uf: "SP", endereco: "Rua Tuiuti, Nº 800, Tatuapé, São Paulo - SP", preco: 84.95 },
  { id: 3, nome: "Pinheiros - SP", uf: "SP", endereco: "Rua Teodoro Sampaio, Nº 450, Pinheiros, São Paulo - SP", preco: 129.9 },
  { id: 4, nome: "BH - Savassi - MG", uf: "MG", endereco: "Av. do Contorno, Nº 6000, Savassi, Belo Horizonte - MG", preco: 99.9 },
  { id: 5, nome: "BH - Cristiano Machado - MG", uf: "MG", endereco: "Av. Cristiano Machado, Nº 1700, Silveira, Belo Horizonte - MG", preco: 74.95 },
  { id: 6, nome: "Barra da Tijuca - RJ", uf: "RJ", endereco: "Av. das Américas, Nº 3000, Barra da Tijuca, Rio de Janeiro - RJ", preco: 149.9 },
  { id: 7, nome: "Praia do Canto - ES", uf: "ES", endereco: "Av. Rio Branco, Nº 500, Praia do Canto, Vitória - ES", preco: 89.9 },
  { id: 8, nome: "Pituba - BA", uf: "BA", endereco: "Av. Manoel Dias da Silva, Nº 900, Pituba, Salvador - BA", preco: 84.95 },
  { id: 9, nome: "Boa Viagem - PE", uf: "PE", endereco: "Av. Boa Viagem, Nº 2500, Boa Viagem, Recife - PE", preco: 94.9 },
  { id: 10, nome: "Aldeota - CE", uf: "CE", endereco: "Av. Santos Dumont, Nº 1500, Aldeota, Fortaleza - CE", preco: 79.9 },
];
const UFS = [...new Set(UNIDADES.map((u) => u.uf))];
const OBJETIVOS = [
  { id: "emagrecer", nome: "Emagrecer", desc: "Queimar gordura e ganhar fôlego", mod: ["Funcional", "Spinning"],
    treino: ["Circuito funcional", "Spinning", "Musculação full body", "Funcional + core", "Cardio leve e mobilidade"] },
  { id: "hipertrofia", nome: "Ganhar massa", desc: "Força e aumento de massa muscular", mod: ["Musculação"],
    treino: ["Peito, ombros e tríceps", "Costas e bíceps", "Pernas e glúteos", "Ombros e abdômen", "Full body leve"] },
  { id: "condicionamento", nome: "Condicionamento", desc: "Mais energia e resistência", mod: ["Funcional", "Boxe"],
    treino: ["Funcional de força", "Boxe fitness", "Spinning intervalado", "Funcional + core", "Mobilidade ativa"] },
  { id: "saude", nome: "Saúde e bem-estar", desc: "Postura, mobilidade e rotina leve", mod: ["Musculação", "Yoga"],
    treino: ["Musculação full body", "Yoga e alongamento", "Caminhada + core", "Musculação full body B", "Yoga restaurativa"] },
];
const NIVEIS = [
  { id: "iniciante", nome: "Iniciante", dica: "Foco na técnica: 2 a 3 séries por exercício e cargas leves nas primeiras 4 semanas." },
  { id: "intermediario", nome: "Intermediário", dica: "Progressão de carga a cada 2 semanas, 3 a 4 séries e treinos mais intensos." },
  { id: "avancado", nome: "Avançado", dica: "Periodização com cargas altas, técnicas avançadas e controle de volume semanal." },
];
const PERSONAIS = [
  { id: 1, nome: "Carla Mendes", unidades: [1, 2, 6, 9], espec: ["emagrecer", "condicionamento"], nota: 4.9, anos: 8, dias: [1, 2, 3, 4, 5], turnos: ["manha", "noite"] },
  { id: 2, nome: "Rodrigo Alves", unidades: [1, 3, 4, 7], espec: ["hipertrofia"], nota: 4.8, anos: 10, dias: [1, 2, 3, 4, 6], turnos: ["tarde", "noite"] },
  { id: 3, nome: "Paula Nogueira", unidades: [2, 4, 5, 8], espec: ["saude", "emagrecer"], nota: 4.9, anos: 6, dias: [2, 3, 4, 5, 6], turnos: ["manha", "tarde"] },
  { id: 4, nome: "Marcos Vieira", unidades: [3, 5, 6, 10], espec: ["condicionamento", "hipertrofia"], nota: 4.7, anos: 7, dias: [1, 3, 5, 6], turnos: ["manha", "noite"] },
  { id: 5, nome: "Júlia Ramos", unidades: [1, 7, 8, 9, 10], espec: ["saude", "condicionamento"], nota: 4.8, anos: 5, dias: [1, 2, 4, 5], turnos: ["tarde", "noite"] },
  { id: 6, nome: "Felipe Duarte", unidades: [2, 4, 6, 8, 10], espec: ["hipertrofia", "emagrecer"], nota: 4.6, anos: 4, dias: [1, 2, 3, 4, 5], turnos: ["manha", "tarde", "noite"] },
];
const HORAS = { manha: ["06:00", "07:00", "08:00", "09:00"], tarde: ["14:00", "15:00", "16:00"], noite: ["18:00", "19:00", "20:00"] };
const nomeObj = (id) => OBJETIVOS.find((o) => o.id === id)?.nome;
const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const brl = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const iniciais = (n) => n.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
const maskPhone = (v) => v.replace(/\D/g, "").slice(0, 11).replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2");
const dataLonga = (iso) => new Date(iso + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
const proximosDias = () => Array.from({ length: 7 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() + i + 1);
  return { iso: d.toLocaleDateString("sv-SE"), dow: d.getDay(),
    sem: d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""), dia: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) };
});
const ocupadoFake = (pid, data, hora) => [...`${pid}${data}${hora}`].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % 4 === 0;

const ICONES = {
  halter: "M6 7v10M3 10v4M18 7v10M21 10v4M6 12h12", check: "M20 6L9 17l-5-5",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  pin: "M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  cal: "M3 4h18v18H3zM16 2v4M8 2v4M3 10h18",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  out: "M7 17L17 7M7 7h10v10",
  down: "M6 9l6 6 6-6",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  trend: "M22 7l-8.5 8.5-5-5L2 17M16 7h6v6",
};
const Icon = ({ n }) => (
  <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={ICONES[n]} /></svg>
);
const Erro = ({ e }) => (e ? <small className="erro" role="alert">{e.message}</small> : null);

const schema = z.object({
  objetivo: z.string().min(1, "Escolha seu objetivo"),
  nivel: z.string().min(1, "Escolha seu nível"),
  dias: z.string().min(1, "Escolha quantos dias por semana"),
  unidade: z.string().min(1, "Escolha a unidade"),
  personal: z.string().min(1, "Escolha um personal"),
  dia: z.string().min(1, "Escolha o dia"),
  horario: z.string().min(1, "Escolha um horário"),
  nome: z.string().trim().min(3, "Informe seu nome").refine((v) => v.split(/\s+/).length >= 2, "Informe nome e sobrenome"),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "E-mail inválido"),
  telefone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Telefone inválido, use (00) 00000-0000"),
  termos: z.boolean().refine((v) => v === true, "É necessário aceitar para continuar"),
});
const STEPS = [
  { t: "Objetivo", campos: ["objetivo", "nivel", "dias"] },
  { t: "Unidade", campos: ["unidade"] },
  { t: "Personal", campos: ["personal"] },
  { t: "Dia e horário", campos: ["dia", "horario"] },
  { t: "Seus dados", campos: ["nome", "email", "telefone", "termos"] },
];
const DEP = { unidade: ["personal", "dia", "horario"], personal: ["dia", "horario"], dia: ["horario"] };

function TreinoRecomendado({ v }) {
  const obj = OBJETIVOS.find((o) => o.id === v.objetivo);
  const nivel = NIVEIS.find((n) => n.id === v.nivel);
  if (!obj) return null;
  return (
    <div className="treino">
      <strong>Treino recomendado para você</strong>
      <div className="tags">{obj.mod.map((m) => <span key={m}>{m}</span>)}</div>
      <ol>{obj.treino.slice(0, Number(v.dias) || 3).map((t) => <li key={t}>{t}</li>)}</ol>
      {nivel && <p>{nivel.dica}</p>}
    </div>
  );
}

export default function App() {
  const [etapa, setEtapa] = useState(0);
  const [feito, setFeito] = useState(null);
  const [detalhe, setDetalhe] = useState(false);
  const [busca, setBusca] = useState("");
  const [uf, setUf] = useState("");
  const [agend, setAgend] = useState(() => {
    try { return JSON.parse(localStorage.getItem("allpfit-agendamentos-v2")) ?? []; } catch { return []; }
  });
  useEffect(() => { localStorage.setItem("allpfit-agendamentos-v2", JSON.stringify(agend)); }, [agend]);

  const { register, handleSubmit, trigger, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema), mode: "onTouched",
    defaultValues: { objetivo: "", nivel: "", dias: "", unidade: "", personal: "", dia: "", horario: "", nome: "", email: "", telefone: "", termos: false },
  });
  useEffect(() => { ["objetivo", "nivel", "dias", "unidade", "personal", "dia", "horario"].forEach((c) => register(c)); }, [register]);

  const v = watch();
  const escolher = (campo, valor) => {
    setValue(campo, valor, { shouldValidate: true });
    (DEP[campo] || []).forEach((d) => setValue(d, ""));
  };

  const unidadeSel = UNIDADES.find((u) => u.id === Number(v.unidade));
  const listaUnid = UNIDADES.filter((u) => (!uf || u.uf === uf) && norm(`${u.nome} ${u.endereco}`).includes(norm(busca)));
  const personais = PERSONAIS.filter((p) => p.unidades.includes(Number(v.unidade)))
    .sort((a, b) => b.espec.includes(v.objetivo) - a.espec.includes(v.objetivo));
  const personal = PERSONAIS.find((p) => p.id === Number(v.personal));
  const dias7 = proximosDias();
  const livre = (h) => !ocupadoFake(personal.id, v.dia, h) && !agend.some((a) => a.personal === personal.id && a.dia === v.dia && a.horario === h);
  const horarios = personal ? personal.turnos.flatMap((t) => HORAS[t]) : [];

  const avancar = async () => { if (await trigger(STEPS[etapa].campos)) setEtapa(etapa + 1); };
  const enviar = (d) => {
    const novo = { ...d, id: Date.now(), codigo: "AF-" + Math.random().toString(36).slice(2, 6).toUpperCase(), personalNome: personal.nome, unidadeNome: unidadeSel.nome };
    setAgend((l) => [novo, ...l]); setDetalhe(false); setFeito(novo);
  };
  const abrirDetalhes = (a) => { setFeito(a); setDetalhe(true); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const novoAgendamento = () => { reset(); setEtapa(0); setFeito(null); setDetalhe(false); setBusca(""); setUf(""); };

  return (
    <div className="pagina">
      <header className="topo">
        <img src={logo} alt="allp fit" className="logo" />
        <nav className="links" aria-hidden="true">
          {["Início", "Planos", "Sobre nós", "Mídia", "Comunidade", "FAQ"].map((l) => <span key={l}>{l}</span>)}
          <span>Unidades<Icon n="out" /></span>
          <span>Mais<Icon n="down" /></span>
        </nav>
        <div className="topo-btns">
          <button className="nav-btn claro" disabled><span className="mini"><Icon n="trend" /></span>Seja um franqueado</button>
          <button className="nav-btn escuro" disabled><Icon n="user" />Espaço do Aluno</button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-txt">
          <span className="tag">Aula experimental grátis</span>
          <h1>Sua primeira aula é <em>por nossa conta</em></h1>
          <p>Conte seu objetivo, receba uma recomendação de treino e agende com um personal da unidade mais perto de você.</p>
          <ul className="bens">
            <li><Icon n="check" />Sem compromisso e sem taxa</li>
            <li><Icon n="check" />Personal indicado para o teu objetivo</li>
            <li><Icon n="check" />Confirmação na hora</li>
          </ul>
        </div>

        <div className="wiz">
          {feito ? (
            <div className="sucesso">
              <div className="check"><Icon n="check" /></div>
              <h2>{detalhe ? "Detalhes do agendamento" : "Aula agendada!"}</h2>
              <p>Apresente o código na recepção da unidade.</p>
              <div className="codigo">{feito.codigo}</div>
              <ul className="resumo">
                <li><Icon n="cal" />{dataLonga(feito.dia)} às {feito.horario}</li>
                <li><Icon n="pin" />Allp Fit {feito.unidadeNome}</li>
                <li><Icon n="halter" />Personal {feito.personalNome} · {nomeObj(feito.objetivo)}</li>
              </ul>
              <TreinoRecomendado v={feito} />
              <div className="fim-acoes">
                <button className="btn primario" onClick={novoAgendamento}>{detalhe ? "Voltar" : "Novo agendamento"}</button>
                {!detalhe && (
                  <>
                    <button className="btn" disabled>Página inicial</button>
                    <button className="btn" disabled>Conhecer planos</button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(enviar)} noValidate>
              <ol className="steps">
                {STEPS.map((s, i) => (
                  <li key={s.t} className={i === etapa ? "atual" : i < etapa ? "feito" : ""}><span>{i < etapa ? "✓" : i + 1}</span><b>{s.t}</b></li>
                ))}
              </ol>

              {etapa === 0 && (
                <div className="bloco">
                  <h3>Qual é o seu objetivo?</h3>
                  <div className="opcoes grande">
                    {OBJETIVOS.map((o) => (
                      <button type="button" key={o.id} className={`op ${v.objetivo === o.id ? "sel" : ""}`} onClick={() => escolher("objetivo", o.id)}>
                        <strong>{o.nome}</strong><small>{o.desc}</small>
                      </button>
                    ))}
                  </div>
                  <Erro e={errors.objetivo} />
                  <h3>Seu nível</h3>
                  <div className="opcoes">
                    {NIVEIS.map((n) => <button type="button" key={n.id} className={`op ${v.nivel === n.id ? "sel" : ""}`} onClick={() => escolher("nivel", n.id)}>{n.nome}</button>)}
                  </div>
                  <Erro e={errors.nivel} />
                  <h3>Quantos dias por semana?</h3>
                  <div className="opcoes">
                    {[2, 3, 4, 5].map((d) => <button type="button" key={d} className={`op ${v.dias === String(d) ? "sel" : ""}`} onClick={() => escolher("dias", String(d))}>{d}x</button>)}
                  </div>
                  <Erro e={errors.dias} />
                </div>
              )}

              {etapa === 1 && (
                <div className="bloco">
                  <h3>Encontre a unidade</h3>
                  <div className="filtros">
                    <label className="busca"><Icon n="search" /><input placeholder="Digite a sua rua, bairro ou cidade" value={busca} onChange={(e) => setBusca(e.target.value)} /></label>
                    <select value={uf} onChange={(e) => setUf(e.target.value)}>
                      <option value="">Todos os estados</option>
                      {UFS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="unidades">
                    {listaUnid.map((u) => (
                      <button type="button" key={u.id} className={`unidade ${v.unidade === String(u.id) ? "sel" : ""}`} onClick={() => escolher("unidade", String(u.id))}>
                        <span className="foto"><Icon n="halter" /></span>
                        <div><strong>{u.nome}</strong><small>{u.endereco}</small><span className="preco">Planos a partir de <b>{brl(u.preco)}</b></span></div>
                      </button>
                    ))}
                    {listaUnid.length === 0 && <p className="vazio">Nenhuma unidade encontrada.</p>}
                  </div>
                  <Erro e={errors.unidade} />
                </div>
              )}

              {etapa === 2 && unidadeSel && (
                <div className="bloco">
                  <div className="resumo-box"><strong>Allp Fit {unidadeSel.nome}</strong><span>{unidadeSel.endereco}</span></div>
                  <TreinoRecomendado v={v} />
                  <h3>Escolha seu personal</h3>
                  <div className="personais">
                    {personais.map((p) => (
                      <button type="button" key={p.id} className={`personal ${v.personal === String(p.id) ? "sel" : ""}`} onClick={() => escolher("personal", String(p.id))}>
                        <span className="avatar">{iniciais(p.nome)}</span>
                        <div>
                          <strong>{p.nome}</strong>
                          <small><Icon n="star" />{p.nota} · {p.anos} anos de experiência</small>
                          <small>{p.espec.map(nomeObj).join(" · ")}</small>
                        </div>
                        {p.espec.includes(v.objetivo) && <em>Indicado</em>}
                      </button>
                    ))}
                  </div>
                  <Erro e={errors.personal} />
                </div>
              )}

              {etapa === 3 && personal && (
                <div className="bloco">
                  <h3>Escolha o dia</h3>
                  <div className="opcoes dias">
                    {dias7.map((d) => (
                      <button type="button" key={d.iso} disabled={!personal.dias.includes(d.dow)} className={`op ${v.dia === d.iso ? "sel" : ""}`} onClick={() => escolher("dia", d.iso)}>
                        <small>{d.sem}</small><strong>{d.dia}</strong>
                      </button>
                    ))}
                  </div>
                  <Erro e={errors.dia} />
                  {v.dia && (
                    <>
                      <h3>Horários com {personal.nome.split(" ")[0]}</h3>
                      <div className="opcoes horas">
                        {horarios.map((h) => (
                          <button type="button" key={h} disabled={!livre(h)} className={`op ${v.horario === h ? "sel" : ""}`} onClick={() => escolher("horario", h)}>{h}</button>
                        ))}
                      </div>
                      <small className="dica">Horários riscados já foram reservados.</small>
                      <Erro e={errors.horario} />
                    </>
                  )}
                </div>
              )}

              {etapa === 4 && personal && (
                <div className="bloco">
                  <div className="resumo-box">
                    <strong>{dataLonga(v.dia)} às {v.horario}</strong>
                    <span>Allp Fit {unidadeSel.nome} · Personal {personal.nome}</span>
                  </div>
                  <label className="campo">Nome completo *<input {...register("nome")} placeholder="Ex.: Maria da Silva" /><Erro e={errors.nome} /></label>
                  <div className="duas"><label className="campo">E-mail *<input type="email" {...register("email")} placeholder="voce@email.com" /><Erro e={errors.email} /></label>
                  <label className="campo">Telefone *<input {...register("telefone", { onChange: (e) => setValue("telefone", maskPhone(e.target.value), { shouldValidate: true }) })} placeholder="(00) 00000-0000" inputMode="tel" /><Erro e={errors.telefone} /></label></div>
                  <label className="termos"><input type="checkbox" {...register("termos")} />Aceito ser contatado pela Allp Fit para confirmar minha aula.</label>
                  <Erro e={errors.termos} />
                </div>
              )}

              <footer className="rodape">
                {etapa > 0 ? <button type="button" className="btn" onClick={() => setEtapa(etapa - 1)}>Voltar</button> : <span />}
                {etapa < STEPS.length - 1
                  ? <button type="button" className="btn primario" onClick={avancar}>Continuar</button>
                  : <button type="submit" className="btn primario">Agendar aula</button>}
              </footer>
            </form>
          )}
        </div>
      </section>

      {agend.length > 0 && (
        <section className="meus">
          <h2>Seus agendamentos</h2>
          {agend.map((a) => (
            <div key={a.id} className="ag">
              <div><strong>{dataLonga(a.dia)} às {a.horario}</strong><small>{a.unidadeNome} · {a.personalNome} · {a.codigo}</small></div>
              <div className="ag-acoes">
                <button className="btn-detalhes" onClick={() => abrirDetalhes(a)}>Detalhes</button>
                <button className="btn-cancelar" onClick={() => { setAgend((l) => l.filter((x) => x.id !== a.id)); if (feito?.id === a.id) novoAgendamento(); }}>Cancelar</button>
              </div>
            </div>
          ))}
        </section>
      )}
      <p className="nota">Projeto demonstrativo. Unidades, personais, horários e dados fictícios, salvos no navegador (localStorage).</p>
    </div>
  );
}
