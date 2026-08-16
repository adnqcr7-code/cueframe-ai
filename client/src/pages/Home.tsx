import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  CircleHelp,
  Eye,
  FileText,
  Link2,
  Loader2,
  Play,
  Search,
  Sparkles,
  Timer,
  WandSparkles,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

// Paper Signal style: editorial workspace, ink navy + cream surfaces, amber timestamps.
// This page keeps transcript as the primary evidence surface and makes visual inspection explicit.

type TranscriptLine = {
  time: string;
  seconds: number;
  text: string;
  tag?: string;
};

const transcript: TranscriptLine[] = [
  { time: "00:00", seconds: 0, text: "Most AI systems begin with the expensive part: watching everything.", tag: "opening" },
  { time: "00:18", seconds: 18, text: "A better starting point is to turn the spoken layer into a small, searchable map.", tag: "principle" },
  { time: "00:42", seconds: 42, text: "The model can answer ordinary questions from the transcript without touching a single frame.", tag: "text-first" },
  { time: "01:20", seconds: 80, text: "When the user asks what appears on screen, we request only the moment that matters.", tag: "vision-on-request" },
  { time: "01:47", seconds: 107, text: "That keeps the context window smaller, the answer faster, and the visual evidence deliberate.", tag: "why-it-works" },
  { time: "02:11", seconds: 131, text: "Every answer can point back to a timestamp, so the viewer can verify the claim in one click.", tag: "citations" },
  { time: "02:35", seconds: 155, text: "The result is not a replacement for video. It is a better way to ask the video questions.", tag: "closing" },
];

function extractVideoId(value: string) {
  const match = value.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/i);
  return match?.[1] ?? (value.trim() || "M7lc1UVf-VE");
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remaining}`;
}

export default function Home() {
  const [url, setUrl] = useState("https://www.youtube.com/watch?v=M7lc1UVf-VE");
  const [videoId, setVideoId] = useState("M7lc1UVf-VE");
  const [query, setQuery] = useState("");
  const [activeSeconds, setActiveSeconds] = useState(80);
  const [isLoading, setIsLoading] = useState(false);
  const [inspectionMode, setInspectionMode] = useState(false);
  const [showTools, setShowTools] = useState(false);

  const filteredTranscript = useMemo(() => {
    if (!query.trim()) return transcript;
    return transcript.filter((line) => `${line.text} ${line.tag}`.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const jumpTo = (seconds: number) => {
    setActiveSeconds(seconds);
    const iframe = document.getElementById("youtube-player") as HTMLIFrameElement | null;
    if (iframe) iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&start=${seconds}&enablejsapi=1`;
  };

  const loadVideo = () => {
    setIsLoading(true);
    window.setTimeout(() => {
      setVideoId(extractVideoId(url));
      setIsLoading(false);
      toast.success("Video workspace ready", { description: "Demo transcript loaded with timestamp anchors." });
    }, 550);
  };

  const inspectMoment = () => {
    setInspectionMode(true);
    toast("Visual inspection queued", { description: `The AI would inspect the moment at ${formatTime(activeSeconds)}.` });
  };

  return (
    <div className="min-h-screen bg-[#f2eee7] text-[#102333] selection:bg-[#e6a24a]/30">
      <header className="border-b border-[#102333]/10 bg-[#f7f3ed]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="relative grid h-10 w-10 place-items-center rounded-[13px] bg-[#102333] shadow-[4px_4px_0_#e6a24a]">
              <Play className="h-4 w-4 fill-[#f7f3ed] text-[#f7f3ed]" />
              <span className="absolute bottom-[7px] right-[7px] h-1.5 w-1.5 rounded-full bg-[#e6a24a]" />
            </div>
            <div>
              <div className="font-display text-[20px] font-semibold tracking-[-0.04em]">Video Context</div>
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#102333]/55">Transcript first / vision on request</div>
            </div>
          </div>
          <div className="hidden items-center gap-6 text-[12px] font-medium text-[#102333]/60 md:flex">
            <a href="#workspace" className="transition-colors hover:text-[#102333]">Workspace</a>
            <a href="#how-it-works" className="transition-colors hover:text-[#102333]">How it works</a>
            <button onClick={() => setShowTools((value) => !value)} className="flex items-center gap-1.5 text-[#102333] transition-colors hover:text-[#ba7624]"><WandSparkles className="h-3.5 w-3.5" /> AI tool schema</button>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#102333]/10 bg-white/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[#102333]/60">
            <span className="h-1.5 w-1.5 rounded-full bg-[#77a878]" /> Public alpha
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 pb-16 pt-10 lg:px-10 lg:pt-14">
        <section className="relative grid gap-8 overflow-hidden rounded-[28px] bg-[#102333] px-6 py-8 text-[#f7f3ed] shadow-[10px_10px_0_#d9cfbf] lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-12" id="workspace">
          <div className="relative z-10 max-w-[640px]">
            <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#e6a24a]"><span className="h-px w-8 bg-[#e6a24a]" /> context without the compute bill</div>
            <h1 className="font-display max-w-[650px] text-[50px] font-medium leading-[0.95] tracking-[-0.06em] sm:text-[72px]">Give the model <em className="text-[#e6a24a]">the moment,</em> not the whole movie.</h1>
            <p className="mt-6 max-w-[520px] text-[15px] leading-7 text-[#f7f3ed]/66">A transcript-first workspace for YouTube. Search what was said, jump to the exact timestamp, and ask for visual context only when the words are not enough.</p>
            <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/15 bg-white/[0.07] px-4 py-3.5 focus-within:border-[#e6a24a]/70">
                <Link2 className="h-4 w-4 shrink-0 text-[#e6a24a]" />
                <input aria-label="YouTube URL" value={url} onChange={(event) => setUrl(event.target.value)} className="min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-white/35" placeholder="Paste a YouTube URL" />
              </div>
              <button onClick={loadVideo} className="inline-flex h-[50px] items-center justify-center gap-2 rounded-xl bg-[#e6a24a] px-5 text-[13px] font-semibold text-[#102333] transition-transform hover:-translate-y-0.5 active:scale-[0.97]">{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />} Load context</button>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.13em] text-white/40"><span className="flex items-center gap-1.5"><Check className="h-3 w-3 text-[#77a878]" /> timestamped transcript</span><span className="flex items-center gap-1.5"><Check className="h-3 w-3 text-[#77a878]" /> visual calls on demand</span></div>
          </div>
          <div className="relative hidden min-h-[300px] lg:block">
            <div className="absolute right-[-16%] top-1/2 h-[360px] w-[620px] -translate-y-1/2 rotate-[-8deg] rounded-[24px] border border-white/10 bg-[#19364b] p-5 shadow-2xl">
              <div className="mb-4 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.15em] text-white/45"><span>video_context / 01</span><span className="text-[#e6a24a]">live index</span></div>
              <div className="relative h-[210px] overflow-hidden rounded-[12px] bg-[#0d202f]"><img src="/manus-storage/context-hero_df102b2f.jpg" alt="Abstract timeline and transcript illustration" className="h-full w-full object-cover opacity-60" /><div className="absolute inset-x-7 bottom-9 h-px bg-[#e6a24a]/70" /><span className="absolute bottom-[29px] left-[38%] h-3 w-3 rounded-full border-2 border-[#102333] bg-[#e6a24a] shadow-[0_0_0_5px_#e6a24a33]" /></div>
              <div className="mt-4 flex items-center justify-between text-[11px] text-white/55"><span>07 transcript windows</span><span className="text-[#e6a24a]">01 visual request</span></div>
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="space-y-5">
            <div className="flex items-end justify-between"><div><div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ba7624]">01 / the source</div><h2 className="mt-2 font-display text-[29px] tracking-[-0.04em]">Watch the evidence.</h2></div><button onClick={() => toast("Player controls are ready", { description: "Select any transcript line to jump here." })} className="rounded-full border border-[#102333]/15 p-2 text-[#102333]/55 transition hover:border-[#102333]/40 hover:text-[#102333]" aria-label="Player help"><CircleHelp className="h-4 w-4" /></button></div>
            <div className="overflow-hidden rounded-[20px] bg-[#102333] p-2 shadow-[5px_5px_0_#d9cfbf]"><div className="aspect-video overflow-hidden rounded-[14px] bg-black"><iframe id="youtube-player" className="h-full w-full" src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&start=${activeSeconds}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div></div>
            <div className="flex items-center justify-between rounded-xl border border-[#102333]/10 bg-white/50 px-4 py-3"><div className="flex items-center gap-2.5"><div className="grid h-8 w-8 place-items-center rounded-lg bg-[#e6a24a]/20 text-[#ba7624]"><Timer className="h-4 w-4" /></div><div><div className="text-[12px] font-semibold">Active moment</div><div className="font-mono text-[11px] text-[#102333]/55">{formatTime(activeSeconds)} / 02:35</div></div></div><button onClick={inspectMoment} className="flex items-center gap-2 rounded-lg bg-[#102333] px-3 py-2 text-[11px] font-semibold text-[#f7f3ed] transition hover:bg-[#19364b] active:scale-[0.97]"><Eye className="h-3.5 w-3.5 text-[#e6a24a]" /> Inspect moment</button></div>
          </div>

          <div className="min-w-0">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ba7624]">02 / the spoken layer</div><h2 className="mt-2 font-display text-[29px] tracking-[-0.04em]">Search the transcript.</h2></div><div className="flex items-center gap-2 rounded-full bg-[#e6a24a]/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#9b5f1b]"><FileText className="h-3 w-3" /> demo captions / en</div></div>
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#102333]/10 bg-white/65 px-4 py-3 focus-within:border-[#ba7624]/60"><Search className="h-4 w-4 text-[#102333]/45" /><input aria-label="Search transcript" value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#102333]/35" placeholder="Ask the transcript a question or search a phrase…" /><kbd className="hidden rounded border border-[#102333]/10 bg-[#f2eee7] px-1.5 py-0.5 font-mono text-[9px] text-[#102333]/45 sm:block">⌘ K</kbd></div>
            <div className="mt-4 overflow-hidden rounded-[20px] border border-[#102333]/10 bg-[#f7f3ed]">
              <div className="flex items-center justify-between border-b border-[#102333]/10 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[#102333]/45"><span>{filteredTranscript.length} transcript windows</span><span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#77a878]" /> searchable</span></div>
              <div className="divide-y divide-[#102333]/8">
                {filteredTranscript.map((line) => <button key={line.seconds} onClick={() => jumpTo(line.seconds)} className={`group flex w-full gap-4 px-5 py-4 text-left transition-colors hover:bg-[#e6a24a]/10 ${activeSeconds === line.seconds ? "bg-[#e6a24a]/12" : ""}`}><span className={`mt-0.5 w-10 shrink-0 font-mono text-[11px] font-semibold ${activeSeconds === line.seconds ? "text-[#ba7624]" : "text-[#102333]/45"}`}>{line.time}</span><span className="min-w-0 flex-1"><span className={`block text-[14px] leading-6 ${activeSeconds === line.seconds ? "font-medium text-[#102333]" : "text-[#102333]/72"}`}>{line.text}</span><span className="mt-1.5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[#102333]/35"><span>#{line.tag}</span>{activeSeconds === line.seconds && <span className="flex items-center gap-1 text-[#ba7624]"><Play className="h-2.5 w-2.5 fill-current" /> playing here</span>}</span></span><ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-[#102333]/0 transition group-hover:text-[#ba7624]" /></button>)}
                {!filteredTranscript.length && <div className="px-5 py-10 text-center text-sm text-[#102333]/55">No transcript windows match that phrase.</div>}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-5 border-t border-[#102333]/10 pt-8 md:grid-cols-3" id="how-it-works">
          {[{ icon: BookOpen, title: "Transcript first", text: "The AI gets compact, timestamped text before it ever asks for a frame." }, { icon: Eye, title: "Vision on request", text: "A specific moment triggers a narrow visual check instead of full-video processing." }, { icon: Link2, title: "Cite the moment", text: "Every answer can point back to the exact place in the original video." }].map((item) => <div key={item.title} className="flex gap-4 rounded-2xl bg-white/45 p-5"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#102333] text-[#e6a24a]"><item.icon className="h-4 w-4" /></div><div><h3 className="font-display text-[19px] tracking-[-0.03em]">{item.title}</h3><p className="mt-1.5 text-[12px] leading-5 text-[#102333]/56">{item.text}</p></div></div>)}
        </section>

        {inspectionMode && <section className="mt-8 grid gap-5 rounded-[20px] border border-[#e6a24a]/35 bg-[#fff8ed] p-5 md:grid-cols-[0.75fr_1.25fr]"><div><div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#ba7624]">visual evidence / requested</div><h3 className="mt-2 font-display text-[25px] tracking-[-0.04em]">Moment at {formatTime(activeSeconds)}</h3><p className="mt-2 text-[13px] leading-6 text-[#102333]/60">In the full product, this request would send only this narrow time window to a vision model. This prototype keeps the distinction visible.</p></div><div className="flex items-center gap-4 rounded-xl bg-[#102333] p-4 text-[#f7f3ed]"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-[#e6a24a]/20 text-[#e6a24a]"><Sparkles className="h-5 w-5" /></div><div><div className="text-[13px] font-semibold">Exact frame not connected yet</div><div className="mt-1 text-[11px] leading-5 text-white/55">Evidence source: user-directed player seek · ready for backend adapter</div></div><button onClick={() => setInspectionMode(false)} className="ml-auto self-start text-white/45 transition hover:text-white" aria-label="Close evidence panel"><ChevronDown className="h-4 w-4 rotate-180" /></button></div></section>}

        {showTools && <section className="mt-8 rounded-[20px] border border-[#102333]/12 bg-[#102333] p-6 text-[#f7f3ed] shadow-[5px_5px_0_#d9cfbf]"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#e6a24a]">ai tool contract</div><h3 className="mt-2 font-display text-[25px] tracking-[-0.04em]">Three small calls, one clear job.</h3></div><button onClick={() => setShowTools(false)} className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45 hover:text-white">close</button></div><div className="mt-5 grid gap-3 md:grid-cols-3">{[{ name: "get_video_context", desc: "Find timestamped transcript passages." }, { name: "inspect_video_timestamp", desc: "Inspect a requested visual moment." }, { name: "get_video_timeline", desc: "Return a compact topic outline." }].map((tool) => <div key={tool.name} className="rounded-xl border border-white/10 bg-white/[0.05] p-4"><div className="font-mono text-[11px] text-[#e6a24a]">{tool.name}</div><p className="mt-2 text-[12px] leading-5 text-white/55">{tool.desc}</p></div>)}</div></section>}
      </main>
      <footer className="border-t border-[#102333]/10 px-5 py-6 lg:px-10"><div className="mx-auto flex max-w-[1440px] flex-col gap-2 text-[11px] text-[#102333]/45 sm:flex-row sm:items-center sm:justify-between"><span>Video Context is an open product experiment for lower-compute AI video conversations.</span><span className="font-mono uppercase tracking-[0.13em]">text first / vision on request</span></div></footer>
    </div>
  );
}
