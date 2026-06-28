import { useApp, Avatar, ScoreRing, MatchPill, Bar, Stat, Sparkline, Donut, VBars, AvatarStack, StageBadge } from '../lib/ui'
import { Icon } from '../lib/icons'

/* Connect AI — Candidate pre-call experience for AI screening (candidate-facing) */

function ScreeningCandidate({ onClose }) {
  const [clang, setClang] = React.useState("en");
  const ar = clang === "ar";
  const T = (en, arr) => (ar ? arr : en);
  const dir = ar ? "rtl" : "ltr";

  const [state, setState] = React.useState("landing"); // landing | channel | ready | phoneReady | incall
  const [consent, setConsent] = React.useState([false, false, false]);
  const [channel, setChannel] = React.useState("browser");
  const [phone, setPhone] = React.useState("+966 50 123 4567");
  const [callLang, setCallLang] = React.useState("en");
  const [phoneWhen, setPhoneWhen] = React.useState("now");
  const allConsent = consent.every(Boolean);

  const Shell = ({ children, step }) => (
    <div dir={dir} style={{ position: "fixed", inset: 0, zIndex: 300, background: "var(--canvas)", overflow: "auto", display: "flex", flexDirection: "column", fontFamily: ar ? '"IBM Plex Sans Arabic", sans-serif' : undefined }}>
      <style>{`@keyframes sc-wave{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}`}</style>
      {/* top bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 28px", height: 60, borderBottom: "1px solid var(--border)", background: "var(--surface)", flex: "0 0 auto" }}>
        <div className="flex" style={{ alignItems: "center", gap: 9, flex: 1 }}>
          <span style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(140deg, var(--accent), color-mix(in oklch, var(--accent) 55%, var(--ai)))", display: "grid", placeItems: "center", color: "#fff" }}><Icon name="sparkles" size={15} fill /></span>
          <span style={{ fontWeight: 600, fontSize: 15 }}>Connect <b style={{ color: "var(--accent)" }}>AI</b></span>
        </div>
        {step && <span className="faint" style={{ fontSize: 12.5, fontWeight: 500 }}>{step}</span>}
        <div className="seg" style={{ display: "inline-flex" }}>
          <button className={!ar ? "on" : ""} onClick={() => setClang("en")} style={{ fontSize: 12 }}>EN</button>
          <button className={ar ? "on" : ""} onClick={() => setClang("ar")} style={{ fontSize: 12 }}>العربية</button>
        </div>
        <a className="muted" style={{ fontSize: 12.5, cursor: "pointer" }}>{T("Help", "مساعدة")}</a>
        <button className="btn-icon btn-sm" onClick={onClose} title="Close" style={{ border: "1px solid var(--border)" }}><Icon name="x" size={16} /></button>
      </div>
      <div style={{ flex: 1, padding: "36px 24px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>{children}</div>
      </div>
      {/* footer */}
      <div style={{ flex: "0 0 auto", borderTop: "1px solid var(--border)", padding: "16px 28px", display: "flex", alignItems: "center", gap: 16, justifyContent: "center", fontSize: 12, color: "var(--text-3)" }}>
        <span className="flex" style={{ alignItems: "center", gap: 5 }}><Icon name="sparkles" size={11} fill style={{ color: "var(--accent)" }} />{T("Powered by Connect AI", "مُشغّل بواسطة Connect AI")}</span>
        <a style={{ cursor: "pointer" }}>{T("Privacy policy", "سياسة الخصوصية")}</a>
        <a style={{ cursor: "pointer" }}>{T("Help", "مساعدة")}</a>
      </div>
    </div>
  );

  /* ===== STATE 1 — LANDING / CONSENT ===== */
  if (state === "landing") {
    return (
      <Shell>
        <h1 style={{ fontSize: 27, letterSpacing: "-.02em" }}>{T("Hi Ahmed, your screening call awaits.", "مرحباً أحمد، مكالمة الفرز بانتظارك.")}</h1>
        <p className="muted" style={{ fontSize: 15, marginTop: 8 }}>{T("We're excited to talk with you about the Senior Frontend Engineer role at Connect AI.", "يسعدنا التحدث معك حول وظيفة مهندس واجهات أول في Connect AI.")}</p>

        <div className="card card-pad" style={{ marginTop: 24, padding: 28 }}>
          <span className="badge badge-ai" style={{ textTransform: "uppercase", letterSpacing: ".04em", fontSize: 11 }}><Icon name="sparkles" size={11} fill />{T("AI-conducted call", "مكالمة يُجريها الذكاء")}</span>
          <h2 style={{ fontSize: 21, marginTop: 14 }}>{T("This is an AI screening call", "هذه مكالمة فرز بالذكاء الاصطناعي")}</h2>
          <p style={{ fontSize: 14.5, lineHeight: 1.75, color: "var(--text-2)", marginTop: 10 }}>{T("Your initial screen for this role will be conducted by Connect AI's AI agent — not a human recruiter. This is shorter than a traditional phone screen and more flexible: you can take it whenever you're ready, in English or Arabic, on your phone or in your browser.", "سيُجري الفرز الأولي لهذه الوظيفة وكيل ذكاء اصطناعي من Connect AI — لا مسؤول بشري. وهي أقصر من المكالمة التقليدية وأكثر مرونة: يمكنك إجراؤها متى استعددت، بالعربية أو الإنجليزية، على هاتفك أو في متصفحك.")}</p>
          <p style={{ fontSize: 14.5, lineHeight: 1.75, color: "var(--text-2)", marginTop: 12 }}>{T("Your conversation will be recorded, transcribed, and reviewed by our recruiting team. The team makes all hiring decisions — the AI doesn't decide anything alone.", "ستُسجَّل محادثتك وتُفرَّغ ويراجعها فريق التوظيف. الفريق يتخذ كل قرارات التوظيف — والذكاء لا يقرّر شيئاً بمفرده.")}</p>
          <div className="flex" style={{ gap: 12, marginTop: 20, flexWrap: "wrap" }}>
            <InfoBox icon="clock" text={T("About 15 minutes", "نحو 15 دقيقة")} />
            <InfoBox icon="globe" text={T("English or Arabic", "العربية أو الإنجليزية")} />
            <InfoBox icon="phone" text={T("Phone or browser", "هاتف أو متصفح")} />
          </div>
        </div>

        <div className="card card-pad" style={{ marginTop: 16 }}>
          <h3 style={{ fontSize: 15, marginBottom: 10 }}>{T("What you'll be asked", "ما الذي سيُسأل عنه")}</h3>
          <ul style={{ fontSize: 14, lineHeight: 1.9, color: "var(--text-2)", paddingInlineStart: 20 }}>
            <li>{T("Your background and work authorization", "خلفيتك وتصريح العمل")}</li>
            <li>{T("Your experience with React and TypeScript", "خبرتك في React وTypeScript")}</li>
            <li>{T("Your leadership and team experience", "خبرتك القيادية والعمل الجماعي")}</li>
            <li>{T("Your interest in this role", "اهتمامك بهذه الوظيفة")}</li>
            <li>{T("Any questions you have for us", "أي أسئلة لديك لنا")}</li>
          </ul>
        </div>

        <div className="card card-pad" style={{ marginTop: 16, borderInlineStart: "3px solid var(--ai)" }}>
          <h3 style={{ fontSize: 15, marginBottom: 14 }}>{T("Your rights", "حقوقك")}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              T("I understand this call will be conducted by AI", "أفهم أن هذه المكالمة سيُجريها الذكاء الاصطناعي"),
              T("I consent to the call being recorded and transcribed for evaluation", "أوافق على تسجيل المكالمة وتفريغها للتقييم"),
              T("I understand my recording will be stored for 90 days and reviewed by Connect AI's recruiting team", "أفهم أن تسجيلي سيُحفظ 90 يوماً ويراجعه فريق التوظيف"),
            ].map((txt, i) => (
              <label key={i} className="flex" style={{ alignItems: "flex-start", gap: 11, cursor: "pointer" }} onClick={() => setConsent(c => c.map((x, j) => j === i ? !x : x))}>
                <span style={{ width: 20, height: 20, borderRadius: 5, border: "1.5px solid " + (consent[i] ? "var(--accent)" : "var(--border-strong)"), background: consent[i] ? "var(--accent)" : "transparent", display: "grid", placeItems: "center", flex: "0 0 auto", marginTop: 1 }}>{consent[i] && <Icon name="check" size={13} style={{ color: "#fff" }} />}</span>
                <span style={{ fontSize: 14, lineHeight: 1.5 }}>{txt}</span>
              </label>
            ))}
          </div>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="faint" style={{ fontSize: 12.5 }}>{T("Prefer to talk with a human recruiter instead? ", "تفضّل التحدث مع مسؤول بشري؟ ")}<a style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 600 }}>{T("Request human screening →", "اطلب فرزاً بشرياً →")}</a></div>
            <div className="faint" style={{ fontSize: 12.5 }}>{T("Need to challenge or appeal the AI's evaluation after your call? You'll have that option afterwards.", "تريد الاعتراض على تقييم الذكاء بعد المكالمة؟ ستتاح لك تلك الخيارات لاحقاً.")}</div>
          </div>
        </div>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <button className="btn btn-primary" style={{ height: 48, padding: "0 28px", fontSize: 15 }} disabled={!allConsent} onClick={() => setState("channel")}>{T("Choose how to take the call", "اختر طريقة إجراء المكالمة")}<Icon name={ar ? "chevLeft" : "chevRight"} size={17} /></button>
          <div className="faint" style={{ fontSize: 12.5, marginTop: 12 }}>{T("Can't take it now? Resume later from your invitation email.", "لا يمكنك الآن؟ تابع لاحقاً من بريد الدعوة.")}</div>
        </div>
      </Shell>
    );
  }

  /* ===== STATE 2 — CHANNEL CHOICE ===== */
  if (state === "channel") {
    return (
      <Shell step={T("Step 1 of 2: How would you like to take the call?", "الخطوة 1 من 2: كيف تودّ إجراء المكالمة؟")}>
        <h1 style={{ fontSize: 24, letterSpacing: "-.02em" }}>{T("How would you like to take the call?", "كيف تودّ إجراء المكالمة؟")}</h1>
        <p className="muted" style={{ fontSize: 14.5, marginTop: 8 }}>{T("Both options work equally well. Pick whichever is more comfortable for you.", "كلا الخيارين جيد بالقدر نفسه. اختر الأنسب لك.")}</p>

        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 22 }}>
          {/* Phone */}
          <ChannelCard T={T} selected={channel === "phone"} onSelect={() => setChannel("phone")} icon="phone"
            title={T("We'll call your phone", "سنتصل بهاتفك")} radio={T("Choose phone", "اختر الهاتف")}
            desc={T("Our AI will call you at your phone number. No app needed — just answer when it rings.", "سيتصل بك وكيل الذكاء على رقمك. لا حاجة لتطبيق — فقط أجب عند الرنين.")}
            bullets={[T("Works on any phone", "يعمل على أي هاتف"), T("Use your existing phone signal", "بإشارة هاتفك الحالية"), T("Can take it anywhere", "من أي مكان")]}>
            <div className="field"><label>{T("Your phone number", "رقم هاتفك")}</label>
              <div className="flex" style={{ gap: 8 }}>
                <select className="select" style={{ width: 90 }}><option>+966</option><option>+971</option><option>+20</option></select>
                <input className="input" value={phone} onChange={e => setPhone(e.target.value)} style={{ flex: 1 }} />
              </div>
            </div>
            <div className="faint" style={{ fontSize: 12, marginTop: 8, lineHeight: 1.5 }}>{T("We'll only call from +966 11 XXX XXXX. Save it as "Connect AI" so you don't miss the call.", "سنتصل فقط من +966 11 XXX XXXX. احفظه باسم «Connect AI» كي لا تفوتك المكالمة.")}</div>
          </ChannelCard>

          {/* Browser */}
          <ChannelCard T={T} selected={channel === "browser"} onSelect={() => setChannel("browser")} icon="headphones"
            title={T("Take it in your browser", "أجرِها في متصفحك")} radio={T("Choose browser", "اختر المتصفح")}
            desc={T("Talk through your computer or phone's microphone, right here in your browser.", "تحدّث عبر ميكروفون جهازك مباشرة من المتصفح.")}
            bullets={[T("Works on any device with a microphone", "أي جهاز به ميكروفون"), T("No phone signal needed — uses internet", "دون إشارة هاتف — عبر الإنترنت"), T("See live captions during the call", "ترجمة مباشرة أثناء المكالمة")]}>
            <div className="faint" style={{ fontSize: 12.5, lineHeight: 1.55 }}>{T("We'll test your microphone and connection on the next screen before starting.", "سنختبر الميكروفون والاتصال في الشاشة التالية قبل البدء.")}</div>
            <div className="flex" style={{ alignItems: "center", gap: 7, marginTop: 8, fontSize: 12, color: "var(--text-3)" }}><Icon name="headphones" size={13} />{T("Recommended: a quiet room and headphones.", "يُنصح بغرفة هادئة وسمّاعات.")}</div>
          </ChannelCard>
        </div>

        <div className="flex" style={{ marginTop: 24, alignItems: "center" }}>
          <button className="btn btn-ghost" onClick={() => setState("landing")}><Icon name={ar ? "chevRight" : "chevLeft"} size={15} />{T("Back", "رجوع")}</button>
          <div className="spacer" style={{ flex: 1 }} />
          <button className="btn btn-primary" style={{ height: 46, padding: "0 24px" }} onClick={() => setState(channel === "phone" ? "phoneReady" : "ready")}>{T("Continue", "متابعة")}<Icon name={ar ? "chevLeft" : "chevRight"} size={16} /></button>
        </div>
      </Shell>
    );
  }

  /* ===== STATE 3 (phone path) ===== */
  if (state === "phoneReady") {
    return (
      <Shell step={T("Step 2 of 2: Get ready", "الخطوة 2 من 2: الاستعداد")}>
        <h1 style={{ fontSize: 24, letterSpacing: "-.02em" }}>{T("Confirm your phone call", "أكّد مكالمتك الهاتفية")}</h1>
        <p className="muted" style={{ fontSize: 14.5, marginTop: 8 }}>{T("We'll call you at the number below.", "سنتصل بك على الرقم أدناه.")}</p>
        <div className="card card-pad" style={{ marginTop: 22 }}>
          <div className="field"><label>{T("Phone number", "رقم الهاتف")}</label><input className="input mono" value={phone} onChange={e => setPhone(e.target.value)} style={{ maxWidth: 260 }} /></div>
          <div className="field" style={{ marginTop: 16 }}><label>{T("When should we call?", "متى نتصل؟")}</label>
            <div className="seg" style={{ display: "inline-flex", flexWrap: "wrap" }}>
              {[{ v: "now", l: T("Call me now", "اتصل الآن") }, { v: "5", l: T("In 5 minutes", "بعد 5 دقائق") }, { v: "15", l: T("In 15 minutes", "بعد 15 دقيقة") }].map(o => <button key={o.v} className={phoneWhen === o.v ? "on" : ""} onClick={() => setPhoneWhen(o.v)}>{o.l}</button>)}
            </div>
          </div>
        </div>
        <LangCard T={T} ar={ar} callLang={callLang} setCallLang={setCallLang} />
        <ExpectCard T={T} />
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <button className="btn btn-primary" style={{ height: 48, padding: "0 28px", fontSize: 15 }} onClick={() => onClose()}><Icon name="phone" size={17} />{T("Confirm and wait for the call", "أكّد وانتظر المكالمة")}</button>
          <div className="faint" style={{ fontSize: 12.5, marginTop: 12 }}>{T("Your phone will ring at " + phone + " in about 30 seconds. Save this number: +966 11 XXX XXXX.", "سيرنّ هاتفك على " + phone + " خلال 30 ثانية. احفظ هذا الرقم: +966 11 XXX XXXX.")}</div>
        </div>
      </Shell>
    );
  }

  /* ===== IN-CALL ===== */
  if (state === "incall") {
    return <ScreeningInCall clang={clang} setClang={setClang} onEnd={(early) => setState(early ? "postEarly" : "post")} />;
  }
  if (state === "post" || state === "postEarly") {
    return <ScreeningPostCall clang={clang} setClang={setClang} early={state === "postEarly"} onResume={() => setState("incall")} onClose={onClose} />;
  }

  /* ===== STATE 3 (browser path) ===== */
  return (
    <Shell step={T("Step 2 of 2: Get ready", "الخطوة 2 من 2: الاستعداد")}>
      <h1 style={{ fontSize: 24, letterSpacing: "-.02em" }}>{T("Let's make sure everything's set up", "لنتأكد أن كل شيء جاهز")}</h1>
      <p className="muted" style={{ fontSize: 14.5, marginTop: 8 }}>{T("A quick mic test before we begin.", "اختبار سريع للميكروفون قبل البدء.")}</p>

      <div className="card card-pad" style={{ marginTop: 22, textAlign: "center", padding: 30 }}>
        <span style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--accent-soft)", color: "var(--accent-strong)", display: "grid", placeItems: "center", margin: "0 auto" }}><Icon name="mic" size={28} /></span>
        <div className="flex" style={{ justifyContent: "center", alignItems: "flex-end", gap: 4, height: 44, marginTop: 18 }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => <span key={i} style={{ width: 5, height: 36, borderRadius: 3, background: "var(--accent)", transformOrigin: "bottom", animation: `sc-wave ${0.7 + (i % 4) * 0.18}s ease-in-out ${i * 0.06}s infinite` }} />)}
        </div>
        <div className="flex" style={{ justifyContent: "center", alignItems: "center", gap: 7, marginTop: 16, color: "var(--success)", fontWeight: 600, fontSize: 14 }}>
          <Icon name="check" size={16} />{T("Microphone working — say something to test", "الميكروفون يعمل — قل شيئاً للاختبار")}
        </div>
        <div className="card card-pad" style={{ marginTop: 20, background: "var(--surface-2)", boxShadow: "none", textAlign: "start" }}>
          <h3 style={{ fontSize: 13.5, marginBottom: 9 }}>{T("Tips for the best call", "نصائح لأفضل مكالمة")}</h3>
          <ul style={{ fontSize: 13, lineHeight: 1.85, color: "var(--text-2)", paddingInlineStart: 18 }}>
            <li>{T("Find a quiet space with minimal background noise", "اختر مكاناً هادئاً بأقل ضوضاء")}</li>
            <li>{T("Use headphones if you have them", "استخدم سمّاعات إن وُجدت")}</li>
            <li>{T("Speak clearly and at a normal pace", "تحدّث بوضوح وبإيقاع طبيعي")}</li>
            <li>{T("You can ask the AI to repeat anything", "يمكنك طلب إعادة أي شيء من الذكاء")}</li>
          </ul>
        </div>
      </div>

      <LangCard T={T} ar={ar} callLang={callLang} setCallLang={setCallLang} />
      <ExpectCard T={T} />

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <button className="btn btn-primary" style={{ height: 50, padding: "0 30px", fontSize: 15.5 }} onClick={() => setState("incall")}><Icon name="phone" size={18} />{T("I'm ready — start the call", "أنا جاهز — ابدأ المكالمة")}</button>
        <div style={{ marginTop: 12 }}><a className="muted" style={{ fontSize: 13, cursor: "pointer" }}>{T("Save and continue later", "احفظ وتابع لاحقاً")}</a></div>
      </div>
    </Shell>
  );
}

function InfoBox({ icon, text }) {
  return (
    <div className="flex" style={{ alignItems: "center", gap: 9, flex: "1 1 150px", padding: "12px 14px", background: "var(--surface-2)", borderRadius: "var(--r-md)", border: "1px solid var(--border)" }}>
      <Icon name={icon} size={16} style={{ color: "var(--accent)", flex: "0 0 auto" }} /><span style={{ fontSize: 13, fontWeight: 500 }}>{text}</span>
    </div>
  );
}

function ChannelCard({ T, selected, onSelect, icon, title, desc, bullets, radio, children }) {
  return (
    <div className="card card-pad" onClick={onSelect} style={{ cursor: "pointer", border: "1.5px solid " + (selected ? "var(--accent)" : "var(--border)"), display: "flex", flexDirection: "column", gap: 12 }}>
      <span style={{ width: 48, height: 48, borderRadius: 12, background: selected ? "var(--accent-soft)" : "var(--surface-3)", color: selected ? "var(--accent-strong)" : "var(--text-2)", display: "grid", placeItems: "center" }}><Icon name={icon} size={24} /></span>
      <div style={{ fontWeight: 600, fontSize: 16 }}>{title}</div>
      <div className="muted" style={{ fontSize: 13, lineHeight: 1.6 }}>{desc}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {bullets.map((b, i) => <div key={i} className="flex" style={{ alignItems: "center", gap: 7, fontSize: 12.5, color: "var(--text-2)" }}><Icon name="check" size={13} style={{ color: "var(--success)", flex: "0 0 auto" }} />{b}</div>)}
      </div>
      <label className="flex" style={{ alignItems: "center", gap: 9, cursor: "pointer", marginTop: 2 }}>
        <span style={{ width: 18, height: 18, borderRadius: "50%", border: "1.5px solid " + (selected ? "var(--accent)" : "var(--border-strong)"), background: selected ? "var(--accent)" : "transparent", display: "grid", placeItems: "center", flex: "0 0 auto" }}>{selected && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}</span>
        <span style={{ fontSize: 13.5, fontWeight: 600 }}>{radio}</span>
      </label>
      {selected && <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>{children}</div>}
    </div>
  );
}

function LangCard({ T, ar, callLang, setCallLang }) {
  return (
    <div className="card card-pad" style={{ marginTop: 16 }}>
      <h3 style={{ fontSize: 15, marginBottom: 12 }}>{T("Choose your language", "اختر لغتك")}</h3>
      <div className="seg" style={{ display: "inline-flex" }}>
        <button className={callLang === "en" ? "on" : ""} onClick={() => setCallLang("en")} style={{ padding: "8px 20px" }}>English</button>
        <button className={callLang === "ar" ? "on" : ""} onClick={() => setCallLang("ar")} style={{ padding: "8px 20px" }}>العربية</button>
      </div>
      <div className="faint" style={{ fontSize: 12.5, marginTop: 10 }}>{T("You can switch mid-call by saying "switch to English" or "switch to Arabic".", "يمكنك التبديل أثناء المكالمة بقول «بدّل للعربية» أو «switch to English».")}</div>
    </div>
  );
}

function ExpectCard({ T }) {
  return (
    <div className="card card-pad" style={{ marginTop: 16 }}>
      <h3 style={{ fontSize: 15, marginBottom: 10 }}>{T("What to expect", "ماذا تتوقّع")}</h3>
      <ul style={{ fontSize: 13.5, lineHeight: 1.9, color: "var(--text-2)", paddingInlineStart: 18 }}>
        <li>{T("The AI will introduce itself and ask if you're ready", "سيعرّف الذكاء بنفسه ويسألك إن كنت مستعداً")}</li>
        <li>{T("You'll have a natural conversation — feel free to ask clarifying questions", "ستكون محادثة طبيعية — لا تتردد في طرح أسئلة توضيحية")}</li>
        <li>{T("Call will last about 15 minutes, no longer than 25", "تستغرق المكالمة نحو 15 دقيقة، وبحد أقصى 25")}</li>
        <li>{T("You can pause for a moment by saying "give me a second"", "يمكنك التوقف لحظة بقول «أمهلني لحظة»")}</li>
        <li>{T("The AI handles silence — if you need time to think, take it", "يتعامل الذكاء مع الصمت — خذ وقتك للتفكير")}</li>
      </ul>
    </div>
  );
}

/* ===== IN-CALL EXPERIENCE (browser, voice-only) ===== */
function ScreeningInCall({ clang, setClang, onEnd }) {
  const ar = clang === "ar";
  const T = (en, arr) => (ar ? arr : en);
  const dir = ar ? "rtl" : "ltr";
  const [mic, setMic] = React.useState(true);
  const [cc, setCc] = React.useState(true);
  const [speaker, setSpeaker] = React.useState("candidate"); // ai | candidate | thinking
  const [offline, setOffline] = React.useState(false);
  const [endConfirm, setEndConfirm] = React.useState(false);
  const [wrap, setWrap] = React.useState(false);
  const scrollRef = React.useRef();

  const transcript = [
    { who: "ai", at: "5:42", text: T("Got it — six years of React experience, with the last three at Acme Fintech. Can you walk me through a particularly complex component you built there?", "تمام — ست سنوات خبرة في React، آخر ثلاث في Acme Fintech. هل تصف لي مكوّناً معقّداً بنيته هناك؟") },
    { who: "cand", at: "5:54", text: T("Sure. We had a transaction timeline that showed up to ten thousand transactions per user. The challenge was performance — we were re-rendering the entire list on every state change.", "بالتأكيد. كان لدينا سجل معاملات يعرض حتى عشرة آلاف معاملة للمستخدم. كان التحدي في الأداء — كنا نعيد عرض القائمة كاملة مع كل تغيير حالة.") },
    { who: "ai", at: "6:18", text: T("Interesting. How did you approach that?", "مثير للاهتمام. كيف عالجت ذلك؟") },
    { who: "cand", at: "6:23", cursor: true, text: T("We used virtualization with react-window, combined with memoization on the row components. We also restructured the state so that filter changes only…", "استخدمنا virtualization مع react-window مع memoization لمكوّنات الصفوف. وأعدنا هيكلة الحالة بحيث إن تغييرات الفلترة فقط…") },
  ];

  const statusText = wrap ? T("Wrapping up…", "إنهاء…") : speaker === "ai" ? T("Speaking…", "يتحدث…") : speaker === "thinking" ? T("Thinking…", "يفكّر…") : T("Listening — take your time", "يستمع — خذ وقتك");

  const topics = [
    { done: true, l: T("Background & work authorization", "الخلفية وتصريح العمل") },
    { done: true, prog: true, l: T("React experience", "خبرة React") },
    { l: T("Leadership experience", "الخبرة القيادية") },
    { l: T("Fintech interest", "الاهتمام بالتقنية المالية") },
    { l: T("Your questions for us", "أسئلتك لنا") },
  ];

  return (
    <div dir={dir} style={{ position: "fixed", inset: 0, zIndex: 320, background: "var(--canvas)", display: "flex", flexDirection: "column", fontFamily: ar ? '"IBM Plex Sans Arabic", sans-serif' : undefined }}>
      <style>{`
        @keyframes sc-orb{0%,100%{transform:scale(1);opacity:.9}50%{transform:scale(1.06);opacity:1}}
        @keyframes sc-orb-speak{0%,100%{transform:scale(1)}25%{transform:scale(1.09)}60%{transform:scale(1.02)}}
        @keyframes sc-dot{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}
        @keyframes sc-ring{0%{transform:scale(.85);opacity:.5}100%{transform:scale(1.5);opacity:0}}
        @keyframes sc-blink{50%{opacity:0}}
      `}</style>

      {offline && (
        <div style={{ background: "var(--warning-soft)", borderBottom: "1px solid color-mix(in oklch, var(--warning) 30%, transparent)", padding: "10px 24px", display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--warning)", fontWeight: 600, justifyContent: "center" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--warning)" }} />{T("Connection lost — reconnecting… Your call is paused and saved.", "انقطع الاتصال — إعادة الاتصال… المكالمة متوقفة ومحفوظة.")}
        </div>
      )}

      {/* top bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 24px", height: 56, borderBottom: "1px solid var(--border)", background: "var(--surface)", flex: "0 0 auto" }}>
        <div className="flex" style={{ alignItems: "center", gap: 8, flex: 1 }}>
          <span style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(140deg, var(--accent), color-mix(in oklch, var(--accent) 55%, var(--ai)))", display: "grid", placeItems: "center", color: "#fff" }}><Icon name="sparkles" size={13} fill /></span>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Connect <b style={{ color: "var(--accent)" }}>AI</b></span>
        </div>
        <div className="flex" style={{ alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600 }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: offline ? "var(--warning)" : "var(--success)", animation: offline ? "none" : "sc-orb 1.4s ease-in-out infinite" }} />
          <span>{offline ? T("Paused", "متوقف") : T("Live", "مباشر")}</span>
          <span className="mono faint" style={{ fontWeight: 500 }}>· 6:23 / ~15:00</span>
        </div>
        <div className="flex" style={{ flex: 1, justifyContent: "flex-end" }}>
          <button className="btn btn-subtle btn-sm" onClick={() => setClang(ar ? "en" : "ar")}>{ar ? "AR" : "EN"}<Icon name="chevDown" size={13} /></button>
        </div>
      </div>

      {/* main */}
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 24px" }}>
        <div style={{ display: "flex", gap: 24, maxWidth: 980, margin: "0 auto", alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* conversation column */}
          <div style={{ flex: "1 1 480px", minWidth: 320 }}>
            {/* AI orb */}
            <div style={{ textAlign: "center", marginBottom: 22 }}>
              <div style={{ position: "relative", width: 140, height: 140, margin: "0 auto" }}>
                {speaker === "ai" && !offline && [0, 1].map(i => <span key={i} style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid var(--accent)", animation: `sc-ring 1.8s ease-out ${i * 0.9}s infinite` }} />)}
                <div style={{ width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, color-mix(in oklch, var(--ai) 55%, var(--accent)), var(--accent))", display: "grid", placeItems: "center", color: "#fff", animation: offline ? "none" : (speaker === "ai" ? "sc-orb-speak 1.1s ease-in-out infinite" : "sc-orb 3.4s ease-in-out infinite"), boxShadow: "0 12px 40px color-mix(in oklch, var(--accent) 35%, transparent)" }}>
                  <Icon name="sparkles" size={40} fill />
                </div>
              </div>
              <div style={{ fontWeight: 600, fontSize: 14, marginTop: 16 }}>{T("Connect AI Assistant", "مساعد Connect AI")}</div>
              <span className="badge badge-ai" style={{ marginTop: 6, height: 20 }}><Icon name="sparkles" size={10} fill />{T("AI Screening Agent", "وكيل فرز بالذكاء")}</span>
              <div className="flex" style={{ justifyContent: "center", alignItems: "center", gap: 8, marginTop: 14, fontSize: 14, fontWeight: 600, color: speaker === "candidate" ? "var(--success)" : "var(--accent-strong)" }}>
                {speaker === "thinking"
                  ? <span className="flex" style={{ gap: 4 }}>{[0, 1, 2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", animation: `sc-dot 1s ease-in-out ${i * 0.15}s infinite` }} />)}</span>
                  : <><Icon name={speaker === "candidate" ? "check" : "sparkles"} size={15} fill={speaker !== "candidate"} />{statusText}</>}
              </div>
            </div>

            {/* captions / transcript */}
            {cc ? (
              <div className="card card-pad" style={{ maxWidth: 660, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: 12 }}><a className="muted" style={{ fontSize: 12, cursor: "pointer" }}><Icon name="arrowUp" size={12} /> {T("Show earlier in conversation", "عرض ما سبق في المحادثة")}</a></div>
                <div ref={scrollRef} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {transcript.map((m, i) => (
                    <div key={i} style={{ textAlign: m.who === "cand" ? "end" : "start" }}>
                      <div className="flex" style={{ gap: 6, alignItems: "center", marginBottom: 4, justifyContent: m.who === "cand" ? "flex-end" : "flex-start" }}>
                        {m.who === "ai" && <Icon name="sparkles" size={12} fill style={{ color: "var(--accent)" }} />}
                        <span className="faint" style={{ fontSize: 11.5, fontWeight: 600 }}>{m.who === "ai" ? T("AI", "الذكاء") : "Ahmed"} · {m.at}</span>
                      </div>
                      <div style={{ fontSize: 14.5, lineHeight: 1.65, color: m.who === "cand" ? "var(--text)" : "var(--text-2)" }}>
                        {m.text}{m.cursor && <span style={{ display: "inline-block", width: 7, height: "1.05em", background: "var(--accent)", marginInlineStart: 3, verticalAlign: "text-bottom", borderRadius: 1, animation: "sc-blink 1s steps(2) infinite" }} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card card-pad" style={{ maxWidth: 660, margin: "0 auto", textAlign: "center", color: "var(--text-3)", padding: 30 }}>
                <Icon name="mic" size={22} /><div style={{ marginTop: 8, fontSize: 13.5 }}>{T("Captions are off. Turn them on below to follow along in text.", "الترجمة مغلقة. فعّلها بالأسفل لمتابعة النص.")}</div>
              </div>
            )}
          </div>

          {/* side panel */}
          <div style={{ flex: "0 0 210px", display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 0 }}>
            <div className="card card-pad" style={{ padding: 16 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)", marginBottom: 10 }}>{T("Need help?", "تحتاج مساعدة؟")}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {[{ i: "refresh", l: T("Ask the AI to repeat", "اطلب الإعادة") }, { i: "pause", l: T("Pause for a moment", "إيقاف لحظة") }, { i: "mic", l: T("Mute briefly", "كتم مؤقت") }, { i: "message", l: T("Ask for clarification", "اطلب توضيحاً") }].map((a, i) => (
                  <button key={i} className="btn btn-subtle btn-sm" style={{ justifyContent: "flex-start", gap: 8 }}><Icon name={a.i} size={13} />{a.l}</button>
                ))}
              </div>
              <div className="faint" style={{ fontSize: 11, lineHeight: 1.5, marginTop: 10 }}>{T("You can also just say these out loud — "can you repeat that?" or "give me a second".", "ويمكنك قولها بصوتك أيضاً — «هل تعيد ذلك؟» أو «أمهلني لحظة».")}</div>
            </div>
            <div className="card card-pad" style={{ padding: 16 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)", marginBottom: 10 }}>{T("Today's screening", "فرز اليوم")}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {topics.map((t, i) => (
                  <div key={i} className="flex" style={{ alignItems: "center", gap: 8, fontSize: 12.5, color: t.done ? "var(--text)" : "var(--text-3)" }}>
                    <span style={{ width: 16, height: 16, borderRadius: "50%", flex: "0 0 auto", display: "grid", placeItems: "center", background: t.done ? "var(--success)" : "transparent", border: t.done ? "none" : "1.5px solid var(--border-strong)" }}>{t.done && <Icon name="check" size={10} style={{ color: "#fff" }} />}</span>
                    <span style={{ flex: 1, fontWeight: t.prog ? 600 : 400 }}>{t.l}</span>
                    {t.prog && <span className="badge badge-accent" style={{ height: 17, fontSize: 10 }}>{T("now", "الآن")}</span>}
                  </div>
                ))}
              </div>
              <div style={{ height: 5, borderRadius: 20, background: "var(--surface-3)", marginTop: 12 }}><div style={{ height: "100%", width: "40%", background: "var(--accent)", borderRadius: 20 }} /></div>
              <div className="faint" style={{ fontSize: 11, marginTop: 6 }}>{T("We're about 40% through.", "أنجزنا نحو 40٪.")}</div>
            </div>
            <button className="btn btn-subtle btn-sm" onClick={() => setOffline(o => !o)} style={{ opacity: .8 }}><Icon name="alert" size={12} />{offline ? T("Reconnect", "إعادة الاتصال") : T("Simulate drop", "محاكاة انقطاع")}</button>
          </div>
        </div>
      </div>

      {/* bottom control bar */}
      <div style={{ flex: "0 0 auto", borderTop: "1px solid var(--border)", background: "var(--surface)", padding: "14px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <button className="flex" onClick={() => setMic(m => !m)} style={{ alignItems: "center", gap: 10, padding: "8px 14px", borderRadius: "var(--r-md)", background: mic ? "var(--success-soft)" : "var(--danger-soft)", color: mic ? "var(--success)" : "var(--danger)", fontWeight: 600, fontSize: 13.5 }}>
          <Icon name="mic" size={18} />{mic ? T("Mic on", "الميكروفون يعمل") : T("Muted — AI is waiting", "مكتوم — الذكاء بانتظارك")}
        </button>
        <div className="spacer" style={{ flex: 1 }} />
        <button className="flex" onClick={() => setCc(c => !c)} style={{ alignItems: "center", gap: 7, padding: "7px 12px", borderRadius: "var(--r-sm)", border: "1px solid " + (cc ? "var(--accent)" : "var(--border-strong)"), color: cc ? "var(--accent-strong)" : "var(--text-2)", fontWeight: 600, fontSize: 12.5 }}>
          <span style={{ fontWeight: 700, border: "1.5px solid currentColor", borderRadius: 3, padding: "0 3px", fontSize: 10 }}>CC</span>{cc ? T("Captions on", "الترجمة مفعّلة") : T("Captions off", "الترجمة مغلقة")}
        </button>
        <div className="spacer" style={{ flex: 1 }} />
        <button className="btn-icon btn-sm"><Icon name="gear" size={16} /></button>
        <button className="btn btn-sm" onClick={() => onEnd(false)} style={{ background: "var(--surface-3)", color: "var(--text-2)", fontWeight: 600 }} title="Demo: complete call"><Icon name="check" size={14} />{T("Finish", "إنهاء")}</button>
        <button className="btn btn-sm" onClick={() => setEndConfirm(true)} style={{ background: "var(--danger-soft)", color: "var(--danger)", fontWeight: 600 }}><Icon name="phone" size={15} />{T("End call", "إنهاء المكالمة")}</button>
      </div>

      {endConfirm && (
        <div className="scrim" onClick={() => setEndConfirm(false)}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head"><div style={{ flex: 1, fontWeight: 600 }}>{T("End the call early?", "إنهاء المكالمة مبكراً؟")}</div><button className="btn-icon btn-sm" onClick={() => setEndConfirm(false)}><Icon name="x" size={17} /></button></div>
            <div className="modal-body"><p style={{ fontSize: 14, lineHeight: 1.6 }}>{T("Your responses so far will be saved and shared with the recruiting team. You can't resume this call once it ends.", "ستُحفظ إجاباتك حتى الآن وتُشارَك مع فريق التوظيف. لا يمكن استئناف المكالمة بعد إنهائها.")}</p></div>
            <div className="modal-foot"><div className="spacer" style={{ flex: 1 }} /><button className="btn btn-ghost btn-sm" onClick={() => setEndConfirm(false)}>{T("Keep going", "المتابعة")}</button><button className="btn btn-danger btn-sm" onClick={() => onEnd(true)}>{T("End call", "إنهاء المكالمة")}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== POST-CALL EXPERIENCE ===== */
function ScreeningPostCall({ clang, setClang, early, onResume, onClose }) {
  const ar = clang === "ar";
  const T = (en, arr) => (ar ? arr : en);
  const dir = ar ? "rtl" : "ltr";
  const [appeal, setAppeal] = React.useState(false);
  const [transcript, setTranscript] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const Chrome = ({ children }) => (
    <div dir={dir} style={{ position: "fixed", inset: 0, zIndex: 320, background: "var(--canvas)", overflow: "auto", display: "flex", flexDirection: "column", fontFamily: ar ? '"IBM Plex Sans Arabic", sans-serif' : undefined }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 28px", height: 60, borderBottom: "1px solid var(--border)", background: "var(--surface)", flex: "0 0 auto" }}>
        <div className="flex" style={{ alignItems: "center", gap: 9, flex: 1 }}>
          <span style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(140deg, var(--accent), color-mix(in oklch, var(--accent) 55%, var(--ai)))", display: "grid", placeItems: "center", color: "#fff" }}><Icon name="sparkles" size={15} fill /></span>
          <span style={{ fontWeight: 600, fontSize: 15 }}>Connect <b style={{ color: "var(--accent)" }}>AI</b></span>
        </div>
        <div className="seg" style={{ display: "inline-flex" }}>
          <button className={!ar ? "on" : ""} onClick={() => setClang("en")} style={{ fontSize: 12 }}>EN</button>
          <button className={ar ? "on" : ""} onClick={() => setClang("ar")} style={{ fontSize: 12 }}>العربية</button>
        </div>
        <button className="btn-icon btn-sm" onClick={onClose} title="Close" style={{ border: "1px solid var(--border)" }}><Icon name="x" size={16} /></button>
      </div>
      <div style={{ flex: 1, padding: "36px 24px 24px" }}><div style={{ maxWidth: 720, margin: "0 auto" }}>{children}</div></div>
      <div style={{ flex: "0 0 auto", borderTop: "1px solid var(--border)", padding: "16px 28px", display: "flex", alignItems: "center", gap: 16, justifyContent: "center", fontSize: 12, color: "var(--text-3)" }}>
        <span className="flex" style={{ alignItems: "center", gap: 5 }}><Icon name="sparkles" size={11} fill style={{ color: "var(--accent)" }} />{T("Powered by Connect AI", "مُشغّل بواسطة Connect AI")}</span>
        <a style={{ cursor: "pointer" }}>{T("Privacy policy", "سياسة الخصوصية")}</a>
      </div>
    </div>
  );

  /* ===== EARLY ENDED ===== */
  if (early) {
    return (
      <Chrome>
        <span style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--warning-soft)", color: "var(--warning)", display: "grid", placeItems: "center", margin: "0 auto 16px" }}><Icon name="phone" size={28} /></span>
        <h1 style={{ fontSize: 25, textAlign: "center", letterSpacing: "-.02em" }}>{T("Call ended early", "انتهت المكالمة مبكراً")}</h1>
        <p className="muted" style={{ fontSize: 15, textAlign: "center", marginTop: 8 }}>{T("It looks like the call ended before all topics were covered. No problem — here's what to do:", "يبدو أن المكالمة انتهت قبل تغطية كل المواضيع. لا مشكلة — إليك الخيارات:")}</p>
        <div className="card card-pad" style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 16 }}>
          <Numbered n={1} title={T("Want to finish later?", "تريد الإكمال لاحقاً؟")} body={T("Your call link is still valid for the next 48 hours.", "رابط مكالمتك صالح خلال الـ 48 ساعة القادمة.")}>
            <button className="btn btn-primary btn-sm" onClick={onResume}><Icon name="refresh" size={14} />{T("Resume call", "استئناف المكالمة")}</button>
          </Numbered>
          <Numbered n={2} title={T("Prefer a human?", "تفضّل التحدث مع إنسان؟")} body={T("Schedule a call with a human recruiter instead.", "حدّد موعداً مع مسؤول بشري بدلاً من ذلك.")}>
            <button className="btn btn-ghost btn-sm">{T("Request human screening", "اطلب فرزاً بشرياً")}<Icon name={ar ? "chevLeft" : "chevRight"} size={14} /></button>
          </Numbered>
          <Numbered n={3} title={T("Want to withdraw?", "تريد الانسحاب؟")} body={T("You can withdraw your application at any time.", "يمكنك سحب طلبك في أي وقت.")}>
            <button className="btn btn-subtle btn-sm" style={{ color: "var(--text-2)" }}>{T("Withdraw application", "سحب الطلب")}</button>
          </Numbered>
        </div>
      </Chrome>
    );
  }

  /* ===== COMPLETED ===== */
  return (
    <Chrome>
      <div style={{ textAlign: "center" }}>
        <span style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--success-soft)", color: "var(--success)", display: "grid", placeItems: "center", margin: "0 auto 16px" }}><Icon name="check" size={36} /></span>
        <h1 style={{ fontSize: 27, letterSpacing: "-.02em" }}>{T("All done, Ahmed", "تم كل شيء، أحمد")}</h1>
        <p className="muted" style={{ fontSize: 15, marginTop: 8 }}>{T("Thanks for taking the time to talk with us today.", "شكراً لوقتك في الحديث معنا اليوم.")}</p>
      </div>

      {/* summary */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-head"><h3>{T("Call completed", "اكتملت المكالمة")}</h3><div className="spacer" style={{ flex: 1 }} /><span className="faint" style={{ fontSize: 12 }}>{T("June 9, 2026 · 3:42 PM GST", "9 يونيو 2026 · 3:42 م")}</span></div>
        <div className="card-pad">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 28px" }}>
            <KV2 label={T("Duration", "المدة")} value={T("16 minutes 42 seconds", "16 دقيقة 42 ثانية")} />
            <KV2 label={T("Language", "اللغة")} value={T("English", "الإنجليزية")} />
            <KV2 label={T("Topics covered", "المواضيع المغطّاة")} value={`5 ${T("of", "من")} 5`} />
            <KV2 label={T("Channel", "القناة")} value={T("Browser", "المتصفح")} />
          </div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
            <div className="faint" style={{ fontSize: 11.5, fontWeight: 600, marginBottom: 5 }}>{T("Confirmation ID", "رقم التأكيد")}</div>
            <div className="flex" style={{ alignItems: "center", gap: 10 }}>
              <span className="mono" style={{ fontSize: 16, fontWeight: 600, userSelect: "all" }}>SCRN-AH-9X4M2</span>
              <button className="btn btn-subtle btn-sm" onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }}><Icon name={copied ? "check" : "copy"} size={13} />{copied ? T("Copied", "نُسخ") : T("Copy", "نسخ")}</button>
            </div>
            <div className="faint" style={{ fontSize: 11.5, marginTop: 6 }}>{T("Save this if you need to reference your call.", "احفظه إن احتجت للإشارة إلى مكالمتك.")}</div>
          </div>
        </div>
      </div>

      {/* what happens next */}
      <div className="card card-pad" style={{ marginTop: 16 }}>
        <h3 style={{ fontSize: 15, marginBottom: 14 }}>{T("What happens next", "ماذا يحدث بعد ذلك")}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <NextStep n={1} text={T("Our recruiting team will review your call within 5 business days.", "سيراجع فريق التوظيف مكالمتك خلال 5 أيام عمل.")} />
          <NextStep n={2} text={T("You'll receive an email at ahmed.hassan@email.com with the decision.", "ستصلك رسالة على ahmed.hassan@email.com بالقرار.")} />
          <NextStep n={3} text={T("If you advance, we'll set up your next interview round with our engineering team.", "إذا تقدّمت، سنرتّب جولة المقابلة التالية مع فريق الهندسة.")} />
        </div>
      </div>

      {/* questions asked */}
      <div className="card card-pad" style={{ marginTop: 16 }}>
        <h3 style={{ fontSize: 15 }}>{T("We made note of your questions", "دوّنّا أسئلتك")}</h3>
        <p className="faint" style={{ fontSize: 12.5, marginTop: 3, marginBottom: 12 }}>{T("Your recruiter will follow up on these in your next email.", "سيتابعها المسؤول في رسالتك القادمة.")}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[T("What's the typical career progression for senior engineers at Connect AI?", "ما المسار المهني المعتاد لكبار المهندسين في Connect AI؟"), T("Is there a remote work allowance for equipment?", "هل يوجد بدل للمعدّات للعمل عن بُعد؟")].map((q, i) => (
            <div key={i} className="flex" style={{ gap: 9, alignItems: "flex-start", fontSize: 13.5, padding: "10px 12px", background: "var(--surface-2)", borderRadius: "var(--r-sm)" }}><Icon name="message" size={14} style={{ color: "var(--accent)", flex: "0 0 auto", marginTop: 2 }} />{q}</div>
          ))}
        </div>
      </div>

      {/* review transcript */}
      <div className="card card-pad" style={{ marginTop: 16, borderInlineStart: "3px solid var(--ai)" }}>
        <div className="flex" style={{ alignItems: "center", gap: 8, marginBottom: 8 }}><Icon name="sparkles" size={15} fill style={{ color: "var(--ai)" }} /><h3 style={{ fontSize: 15 }}>{T("Want to review what you said?", "تريد مراجعة ما قلته؟")}</h3></div>
        <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.6, marginBottom: 12 }}>{T("You can review the full transcript of your call. This won't change anything — it's just for your records.", "يمكنك مراجعة النص الكامل لمكالمتك. لن يغيّر هذا شيئاً — إنه لسجلّاتك فقط.")}</p>
        <button className="btn btn-ghost btn-sm" onClick={() => setTranscript(true)}><Icon name="doc" size={14} />{T("View transcript", "عرض النص")}<Icon name={ar ? "chevLeft" : "chevRight"} size={14} /></button>
      </div>

      {/* right to challenge */}
      <div className="card card-pad" style={{ marginTop: 16, background: "var(--surface-2)", boxShadow: "none" }}>
        <h3 style={{ fontSize: 13.5, marginBottom: 6 }}>{T("Right to challenge", "حق الاعتراض")}</h3>
        <p className="faint" style={{ fontSize: 12.5, lineHeight: 1.6 }}>{T("If after receiving our decision you feel the AI's evaluation was unfair or inaccurate, you have the right to request a human review.", "إذا شعرت بعد القرار أن تقييم الذكاء كان غير عادل أو غير دقيق، يحقّ لك طلب مراجعة بشرية.")} <a style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 600 }} onClick={() => setAppeal(true)}>{T("Learn how →", "تعرّف كيف →")}</a></p>
      </div>

      {/* while you wait */}
      <div style={{ marginTop: 24 }}>
        <div className="faint" style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: ".04em" }}>{T("While you wait", "بينما تنتظر")}</div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
          {[{ i: "briefcase", t: T("Browse other open roles", "تصفّح وظائف أخرى") }, { i: "doc", t: T("Learn more about Connect AI", "تعرّف أكثر على Connect AI") }, { i: "message", t: T("Got more questions?", "أسئلة أخرى؟") }].map((c, i) => (
            <div key={i} className="card card-interactive card-pad" style={{ textAlign: "center", padding: 16 }}><Icon name={c.i} size={18} style={{ color: "var(--accent)" }} /><div style={{ fontSize: 12.5, fontWeight: 500, marginTop: 8 }}>{c.t}</div></div>
          ))}
        </div>
      </div>

      {appeal && (
        <div className="scrim" onClick={() => setAppeal(false)}>
          <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head"><div style={{ flex: 1, fontWeight: 600 }}>{T("Requesting a human review", "طلب مراجعة بشرية")}</div><button className="btn-icon btn-sm" onClick={() => setAppeal(false)}><Icon name="x" size={17} /></button></div>
            <div className="modal-body" style={{ fontSize: 13.5, lineHeight: 1.7 }}>
              <p style={{ marginBottom: 12 }}>{T("After you receive a decision email, it will include a link to request a human review. A member of our team — not the AI — will re-evaluate your screening independently.", "بعد استلام بريد القرار، سيتضمّن رابطاً لطلب مراجعة بشرية. سيقوم أحد أعضاء فريقنا — لا الذكاء — بإعادة تقييم فرزك بشكل مستقل.")}</p>
              <p className="faint" style={{ fontSize: 12.5 }}>{T("Human reviews are typically completed within 5 business days of your request.", "تكتمل المراجعات البشرية عادةً خلال 5 أيام عمل من طلبك.")}</p>
            </div>
            <div className="modal-foot"><div className="spacer" style={{ flex: 1 }} /><button className="btn btn-primary btn-sm" onClick={() => setAppeal(false)}>{T("Got it", "حسناً")}</button></div>
          </div>
        </div>
      )}
      {transcript && (
        <div className="scrim" onClick={() => setTranscript(false)}>
          <div className="modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head"><div style={{ flex: 1, fontWeight: 600 }}>{T("Your call transcript", "نص مكالمتك")}</div><button className="btn-icon btn-sm" onClick={() => setTranscript(false)}><Icon name="x" size={17} /></button></div>
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 14, background: "var(--surface-2)" }}>
              {[{ w: "ai", t: T("Can you walk me through a particularly complex component you built?", "هل تصف لي مكوّناً معقّداً بنيته؟") }, { w: "cand", t: T("Sure. We had a transaction timeline showing up to ten thousand transactions per user…", "بالتأكيد. كان لدينا سجل معاملات يعرض حتى عشرة آلاف معاملة…") }, { w: "ai", t: T("How did you approach the performance problem?", "كيف عالجت مشكلة الأداء؟") }].map((m, i) => (
                <div key={i}><div className="faint" style={{ fontSize: 11.5, fontWeight: 600, marginBottom: 3 }}>{m.w === "ai" ? T("AI", "الذكاء") : "Ahmed"}</div><div style={{ fontSize: 13.5, lineHeight: 1.6, color: m.w === "cand" ? "var(--text)" : "var(--text-2)" }}>{m.t}</div></div>
              ))}
            </div>
            <div className="modal-foot"><span className="faint" style={{ fontSize: 12, flex: 1 }}>{T("Read-only · for your records", "للقراءة فقط · لسجلّاتك")}</span><button className="btn btn-ghost btn-sm" onClick={() => setTranscript(false)}>{T("Close", "إغلاق")}</button></div>
          </div>
        </div>
      )}
    </Chrome>
  );
}

function KV2({ label, value }) { return <div><div className="faint" style={{ fontSize: 11.5, fontWeight: 600, marginBottom: 3 }}>{label}</div><div style={{ fontSize: 14, fontWeight: 500 }}>{value}</div></div>; }
function NextStep({ n, text }) { return <div className="flex" style={{ gap: 11, alignItems: "flex-start" }}><span className="mono" style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--accent-soft)", color: "var(--accent-strong)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 12, flex: "0 0 auto" }}>{n}</span><span style={{ fontSize: 14, lineHeight: 1.6, paddingTop: 2 }}>{text}</span></div>; }
function Numbered({ n, title, body, children }) { return <div className="flex" style={{ gap: 13, alignItems: "flex-start" }}><span className="mono" style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--surface-3)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 12.5, flex: "0 0 auto" }}>{n}</span><div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div><div className="muted" style={{ fontSize: 13, margin: "3px 0 9px" }}>{body}</div>{children}</div></div>; }

export { ScreeningCandidate, ScreeningInCall, ScreeningPostCall }
